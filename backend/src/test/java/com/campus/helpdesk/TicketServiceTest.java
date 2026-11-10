package com.campus.helpdesk;

import com.campus.helpdesk.dto.AssignTechnicianRequest;
import com.campus.helpdesk.dto.CreateTicketRequest;
import com.campus.helpdesk.dto.UpdateTicketStatusRequest;
import com.campus.helpdesk.exception.ResourceNotFoundException;
import com.campus.helpdesk.model.*;
import com.campus.helpdesk.repository.*;
import com.campus.helpdesk.service.NotificationClientService;
import com.campus.helpdesk.service.TicketServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TechnicianRepository technicianRepository;

    @Mock
    private TicketCommentRepository commentRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @Mock
    private NotificationClientService notificationClientService;

    @InjectMocks
    private TicketServiceImpl ticketService;

    private Category testCategory;
    private Technician testTechnician;
    private Ticket testTicket;

    @BeforeEach
    void setUp() {
        testCategory = new Category(1L, "ELECTRICAL", "Electrical & Power", "Lighting and outlets", 6, "zap");
        testTechnician = new Technician(1L, "Murugan S", "murugan.s@srmist.edu.in", "+91 98401 23452", "Electrical Maintenance", 1, true);

        testTicket = new Ticket();
        testTicket.setId(101L);
        testTicket.setTicketNumber("TICK-2026-1001");
        testTicket.setTitle("Switchboard spark in CSE Lab");
        testTicket.setDescription("Intermittent sparking observed when plugging in workstation.");
        testTicket.setCategory(testCategory);
        testTicket.setPriority(Priority.CRITICAL);
        testTicket.setStatus(Status.OPEN);
        testTicket.setLocation("Tech Park Block 3, Lab 304");
        testTicket.setRequesterName("Aathekesavan R");
        testTicket.setRequesterEmail("ra2411003050015@srmist.edu.in");
        testTicket.setRequesterRole(UserRole.STUDENT);
        testTicket.setCreatedAt(LocalDateTime.now());
        testTicket.setUpdatedAt(LocalDateTime.now());
        testTicket.setSlaDueTime(LocalDateTime.now().plusHours(2));
    }

    @Test
    @DisplayName("Unit IV / CO-4: Should create ticket with SLA calculation and auto-assign technician")
    void testCreateTicketSuccess() {
        CreateTicketRequest req = new CreateTicketRequest();
        req.setTitle("Switchboard spark in CSE Lab");
        req.setDescription("Intermittent sparking observed when plugging in workstation.");
        req.setCategoryId(1L);
        req.setPriority(Priority.CRITICAL);
        req.setLocation("Tech Park Block 3, Lab 304");
        req.setRequesterName("Aathekesavan R");
        req.setRequesterEmail("ra2411003050015@srmist.edu.in");
        req.setRequesterRole(UserRole.STUDENT);

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(technicianRepository.findByAvailableTrue()).thenReturn(List.of(testTechnician));
        when(ticketRepository.save(any(Ticket.class))).thenAnswer(invocation -> {
            Ticket t = invocation.getArgument(0);
            t.setId(201L);
            return t;
        });

        Ticket created = ticketService.createTicket(req);

        assertNotNull(created);
        assertEquals("Switchboard spark in CSE Lab", created.getTitle());
        assertEquals(Status.ASSIGNED, created.getStatus());
        assertEquals("Murugan S", created.getTechnician().getName());
        assertEquals(2, testTechnician.getActiveTickets());
        assertTrue(created.getSlaDueTime().isAfter(LocalDateTime.now()));

        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
        verify(notificationClientService, times(1)).sendNotificationEvent(any());
    }

    @Test
    @DisplayName("Unit IV / CO-4: Should throw ResourceNotFoundException when Category does not exist")
    void testCreateTicketInvalidCategory() {
        CreateTicketRequest req = new CreateTicketRequest();
        req.setTitle("Projector broken");
        req.setDescription("Does not turn on at all.");
        req.setCategoryId(999L);
        req.setLocation("Hall 1");
        req.setRequesterName("Student");
        req.setRequesterEmail("test@srmist.edu.in");

        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> ticketService.createTicket(req));
        verify(ticketRepository, never()).save(any());
    }

    @Test
    @DisplayName("Unit IV / CO-4: Should update ticket status to RESOLVED and decrement active workload")
    void testUpdateTicketStatusToResolved() {
        testTicket.setTechnician(testTechnician);
        testTicket.setStatus(Status.IN_PROGRESS);

        UpdateTicketStatusRequest req = new UpdateTicketStatusRequest();
        req.setStatus(Status.RESOLVED);
        req.setPerformedBy("Murugan S");
        req.setResolutionNotes("Replaced neutral terminal wire.");

        when(ticketRepository.findById(101L)).thenReturn(Optional.of(testTicket));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(testTicket);

        Ticket updated = ticketService.updateTicketStatus(101L, req);

        assertNotNull(updated);
        assertEquals(Status.RESOLVED, updated.getStatus());
        assertEquals("Replaced neutral terminal wire.", updated.getResolutionNotes());
        assertNotNull(updated.getResolvedAt());
        assertEquals(0, testTechnician.getActiveTickets());

        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
        verify(notificationClientService, times(1)).sendNotificationEvent(any());
    }

    @Test
    @DisplayName("Unit IV / CO-4: Should assign new technician and rebalance workload")
    void testAssignTechnician() {
        Technician tech2 = new Technician(2L, "Ramesh Kumar", "ramesh.k@srmist.edu.in", "+91 98401 23451", "IT", 0, true);

        testTicket.setTechnician(testTechnician); // Murugan has load 1

        AssignTechnicianRequest req = new AssignTechnicianRequest();
        req.setTechnicianId(2L);
        req.setAssignedBy("Admin Coordinator");

        when(ticketRepository.findById(101L)).thenReturn(Optional.of(testTicket));
        when(technicianRepository.findById(2L)).thenReturn(Optional.of(tech2));
        when(ticketRepository.save(any(Ticket.class))).thenReturn(testTicket);

        Ticket assigned = ticketService.assignTechnician(101L, req);

        assertNotNull(assigned);
        assertEquals("Ramesh Kumar", assigned.getTechnician().getName());
        assertEquals(0, testTechnician.getActiveTickets());
        assertEquals(1, tech2.getActiveTickets());
    }
}
