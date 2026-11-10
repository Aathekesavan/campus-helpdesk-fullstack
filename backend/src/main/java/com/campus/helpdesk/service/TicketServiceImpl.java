package com.campus.helpdesk.service;

import com.campus.helpdesk.dto.*;
import com.campus.helpdesk.exception.ResourceNotFoundException;
import com.campus.helpdesk.model.*;
import com.campus.helpdesk.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final CategoryRepository categoryRepository;
    private final TechnicianRepository technicianRepository;
    private final TicketCommentRepository commentRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationClientService notificationClientService;

    @Autowired
    public TicketServiceImpl(
            TicketRepository ticketRepository,
            CategoryRepository categoryRepository,
            TechnicianRepository technicianRepository,
            TicketCommentRepository commentRepository,
            AuditLogRepository auditLogRepository,
            NotificationClientService notificationClientService) {
        this.ticketRepository = ticketRepository;
        this.categoryRepository = categoryRepository;
        this.technicianRepository = technicianRepository;
        this.commentRepository = commentRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationClientService = notificationClientService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ticket> getAllTickets(Status status, Priority priority, Long categoryId, String search) {
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        return ticketRepository.searchTickets(status, priority, categoryId, cleanSearch);
    }

    @Override
    @Transactional(readOnly = true)
    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Helpdesk Ticket not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Ticket getTicketByNumber(String ticketNumber) {
        return ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Helpdesk Ticket not found with tracking code: " + ticketNumber));
    }

    @Override
    public Ticket createTicket(CreateTicketRequest req) {
        Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid category ID: " + req.getCategoryId()));

        Ticket ticket = new Ticket();
        ticket.setTicketNumber(generateUniqueTicketNumber());
        ticket.setTitle(req.getTitle().trim());
        ticket.setDescription(req.getDescription().trim());
        ticket.setCategory(category);
        ticket.setPriority(req.getPriority() != null ? req.getPriority() : Priority.MEDIUM);
        ticket.setLocation(req.getLocation().trim());
        ticket.setRequesterName(req.getRequesterName().trim());
        ticket.setRequesterEmail(req.getRequesterEmail().trim());
        ticket.setRequesterRole(req.getRequesterRole() != null ? req.getRequesterRole() : UserRole.STUDENT);
        ticket.setRequesterPhone(req.getRequesterPhone());

        LocalDateTime now = LocalDateTime.now();
        ticket.setCreatedAt(now);
        ticket.setUpdatedAt(now);

        // Calculate dynamic SLA Due Date based on Category baseline and Priority multiplier
        int computedSlaHours = calculateSlaHours(category.getSlaHours(), ticket.getPriority());
        ticket.setSlaDueTime(now.plusHours(computedSlaHours));

        // Smart Technician Auto-Assignment Heuristic
        List<Technician> availableTechs = technicianRepository.findByAvailableTrue();
        Technician bestTechnician = findBestTechnicianForCategory(availableTechs, category);

        if (bestTechnician != null) {
            ticket.setTechnician(bestTechnician);
            ticket.setStatus(Status.ASSIGNED);
            bestTechnician.setActiveTickets(bestTechnician.getActiveTickets() + 1);
            technicianRepository.save(bestTechnician);
        } else {
            ticket.setStatus(Status.OPEN);
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        // Audit Trail Record (CO-3)
        AuditLog auditLog = new AuditLog(
                savedTicket.getId(),
                "TICKET_CREATED",
                null,
                savedTicket.getStatus().name(),
                savedTicket.getRequesterName(),
                "New ticket submitted via Campus Web Portal"
        );
        auditLogRepository.save(auditLog);

        // Trigger Microservice Notification Dispatch (CO-5)
        NotificationEventDTO event = new NotificationEventDTO(
                "TICKET_CREATED",
                savedTicket.getId(),
                savedTicket.getTicketNumber(),
                savedTicket.getTitle(),
                category.getName(),
                savedTicket.getPriority().name(),
                savedTicket.getRequesterEmail(),
                savedTicket.getRequesterName(),
                "Maintenance request logged successfully with SLA deadline of " + computedSlaHours + " hours."
        );
        notificationClientService.sendNotificationEvent(event);

        return savedTicket;
    }

    @Override
    public Ticket updateTicketStatus(Long id, UpdateTicketStatusRequest req) {
        Ticket ticket = getTicketById(id);
        Status oldStatus = ticket.getStatus();
        Status newStatus = req.getStatus();

        if (oldStatus == newStatus) {
            return ticket;
        }

        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(LocalDateTime.now());

        if (req.getResolutionNotes() != null && !req.getResolutionNotes().trim().isEmpty()) {
            ticket.setResolutionNotes(req.getResolutionNotes().trim());
        }

        if (newStatus == Status.RESOLVED || newStatus == Status.CLOSED) {
            ticket.setResolvedAt(LocalDateTime.now());
            // Decrement active tickets for technician
            if (ticket.getTechnician() != null && ticket.getTechnician().getActiveTickets() > 0) {
                Technician tech = ticket.getTechnician();
                tech.setActiveTickets(Math.max(0, tech.getActiveTickets() - 1));
                technicianRepository.save(tech);
            }
        }

        Ticket updatedTicket = ticketRepository.save(ticket);

        // Audit Log Entry
        AuditLog auditLog = new AuditLog(
                ticket.getId(),
                "STATUS_UPDATED",
                oldStatus.name(),
                newStatus.name(),
                req.getPerformedBy(),
                req.getResolutionNotes() != null ? req.getResolutionNotes() : "Status updated to " + newStatus
        );
        auditLogRepository.save(auditLog);

        // Microservice Notification Dispatch
        NotificationEventDTO event = new NotificationEventDTO(
                "STATUS_CHANGED",
                ticket.getId(),
                ticket.getTicketNumber(),
                ticket.getTitle(),
                ticket.getCategory().getName(),
                ticket.getPriority().name(),
                ticket.getRequesterEmail(),
                req.getPerformedBy(),
                "Ticket status updated from " + oldStatus + " to " + newStatus + "."
        );
        notificationClientService.sendNotificationEvent(event);

        return updatedTicket;
    }

    @Override
    public Ticket assignTechnician(Long id, AssignTechnicianRequest req) {
        Ticket ticket = getTicketById(id);
        Technician newTechnician = technicianRepository.findById(req.getTechnicianId())
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with ID: " + req.getTechnicianId()));

        Technician oldTechnician = ticket.getTechnician();
        if (oldTechnician != null && !oldTechnician.getId().equals(newTechnician.getId())) {
            oldTechnician.setActiveTickets(Math.max(0, oldTechnician.getActiveTickets() - 1));
            technicianRepository.save(oldTechnician);
        }

        ticket.setTechnician(newTechnician);
        newTechnician.setActiveTickets(newTechnician.getActiveTickets() + 1);
        technicianRepository.save(newTechnician);

        if (ticket.getStatus() == Status.OPEN) {
            ticket.setStatus(Status.ASSIGNED);
        }
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);

        // Audit Log
        AuditLog auditLog = new AuditLog(
                ticket.getId(),
                "TICKET_ASSIGNED",
                oldTechnician != null ? oldTechnician.getName() : "Unassigned",
                newTechnician.getName(),
                req.getAssignedBy(),
                "Assigned to staff technician " + newTechnician.getName()
        );
        auditLogRepository.save(auditLog);

        // Notification Microservice Event
        NotificationEventDTO event = new NotificationEventDTO(
                "TICKET_ASSIGNED",
                ticket.getId(),
                ticket.getTicketNumber(),
                ticket.getTitle(),
                ticket.getCategory().getName(),
                ticket.getPriority().name(),
                ticket.getRequesterEmail(),
                req.getAssignedBy(),
                "Technician " + newTechnician.getName() + " (" + newTechnician.getPhone() + ") assigned to your request."
        );
        notificationClientService.sendNotificationEvent(event);

        return savedTicket;
    }

    @Override
    public void deleteTicket(Long id) {
        Ticket ticket = getTicketById(id);
        if (ticket.getTechnician() != null && ticket.getTechnician().getActiveTickets() > 0) {
            Technician tech = ticket.getTechnician();
            tech.setActiveTickets(Math.max(0, tech.getActiveTickets() - 1));
            technicianRepository.save(tech);
        }
        ticketRepository.delete(ticket);
    }

    @Override
    public TicketComment addComment(Long ticketId, TicketCommentRequest req) {
        Ticket ticket = getTicketById(ticketId);

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setAuthorName(req.getAuthorName().trim());
        comment.setAuthorRole(req.getAuthorRole().trim());
        comment.setMessage(req.getMessage().trim());
        comment.setIsInternal(req.getIsInternal() != null ? req.getIsInternal() : false);
        comment.setCreatedAt(LocalDateTime.now());

        TicketComment savedComment = commentRepository.save(comment);

        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return savedComment;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketComment> getComments(Long ticketId) {
        // Verify ticket exists
        getTicketById(ticketId);
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getAuditLogs(Long ticketId) {
        return auditLogRepository.findByTicketIdOrderByTimestampDesc(ticketId);
    }

    // --- Helper Business Methods ---

    private int calculateSlaHours(int baseCategorySla, Priority priority) {
        switch (priority) {
            case CRITICAL:
                return Math.max(2, (int) Math.round(baseCategorySla * 0.25));
            case HIGH:
                return Math.max(4, (int) Math.round(baseCategorySla * 0.5));
            case MEDIUM:
                return baseCategorySla;
            case LOW:
            default:
                return (int) Math.round(baseCategorySla * 1.5);
        }
    }

    private Technician findBestTechnicianForCategory(List<Technician> technicians, Category category) {
        if (technicians == null || technicians.isEmpty()) {
            return null;
        }

        // Try to find a technician matching the department with lowest active load
        return technicians.stream()
                .filter(t -> t.getDepartment().toLowerCase().contains(category.getName().toLowerCase().substring(0, 3)))
                .min((t1, t2) -> Integer.compare(t1.getActiveTickets(), t2.getActiveTickets()))
                .orElse(technicians.stream()
                        .min((t1, t2) -> Integer.compare(t1.getActiveTickets(), t2.getActiveTickets()))
                        .orElse(null));
    }

    private String generateUniqueTicketNumber() {
        int randomDigits = 1000 + new Random().nextInt(9000);
        return "TICK-2026-" + randomDigits;
    }
}
