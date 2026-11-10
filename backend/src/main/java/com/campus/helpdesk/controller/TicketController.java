package com.campus.helpdesk.controller;

import com.campus.helpdesk.dto.AssignTechnicianRequest;
import com.campus.helpdesk.dto.CreateTicketRequest;
import com.campus.helpdesk.dto.TicketCommentRequest;
import com.campus.helpdesk.dto.UpdateTicketStatusRequest;
import com.campus.helpdesk.model.*;
import com.campus.helpdesk.repository.TicketJdbcDao;
import com.campus.helpdesk.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TicketController {

    private final TicketService ticketService;
    private final TicketJdbcDao ticketJdbcDao;

    @Autowired
    public TicketController(TicketService ticketService, TicketJdbcDao ticketJdbcDao) {
        this.ticketService = ticketService;
        this.ticketJdbcDao = ticketJdbcDao;
    }

    /**
     * Get all tickets with optional multi-criteria filtering and keyword search.
     * Demonstrates dynamic JPA querying.
     */
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets(
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search) {
        List<Ticket> tickets = ticketService.getAllTickets(status, priority, categoryId, search);
        return ResponseEntity.ok(tickets);
    }

    /**
     * Get ticket by primary key ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        return ResponseEntity.ok(ticket);
    }

    /**
     * Track ticket by public tracking code (e.g., TICK-2026-1001).
     */
    @GetMapping("/track/{ticketNumber}")
    public ResponseEntity<Ticket> getTicketByNumber(@PathVariable String ticketNumber) {
        Ticket ticket = ticketService.getTicketByNumber(ticketNumber);
        return ResponseEntity.ok(ticket);
    }

    /**
     * Submit a new maintenance ticket with server-side bean validation (@Valid).
     * Automatically triggers SLA computation, heuristic technician assignment, and microservice alert dispatch.
     */
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody CreateTicketRequest request) {
        Ticket createdTicket = ticketService.createTicket(request);
        return new ResponseEntity<>(createdTicket, HttpStatus.CREATED);
    }

    /**
     * Update ticket lifecycle status (OPEN -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request) {
        Ticket updatedTicket = ticketService.updateTicketStatus(id, request);
        return ResponseEntity.ok(updatedTicket);
    }

    /**
     * Assign or reassign ticket to campus maintenance technician.
     */
    @PatchMapping("/{id}/assign")
    public ResponseEntity<Ticket> assignTechnician(
            @PathVariable Long id,
            @Valid @RequestBody AssignTechnicianRequest request) {
        Ticket assignedTicket = ticketService.assignTechnician(id, request);
        return ResponseEntity.ok(assignedTicket);
    }

    /**
     * Delete maintenance ticket.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok(Map.of("message", "Ticket ID " + id + " successfully deleted."));
    }

    /**
     * Fetch comments and discussion history for a ticket.
     */
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<TicketComment>> getTicketComments(@PathVariable Long id) {
        List<TicketComment> comments = ticketService.getComments(id);
        return ResponseEntity.ok(comments);
    }

    /**
     * Post a resolution note or user comment to a ticket.
     */
    @PostMapping("/{id}/comments")
    public ResponseEntity<TicketComment> addComment(
            @PathVariable Long id,
            @Valid @RequestBody TicketCommentRequest request) {
        TicketComment comment = ticketService.addComment(id, request);
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    /**
     * Retrieve audit history and status transition logs.
     */
    @GetMapping("/{id}/audit")
    public ResponseEntity<List<AuditLog>> getAuditTrail(@PathVariable Long id) {
        List<AuditLog> auditLogs = ticketService.getAuditLogs(id);
        return ResponseEntity.ok(auditLogs);
    }

    /**
     * CO-3 / Unit III Dedicated Endpoint:
     * Executes classic Raw JDBC query with explicit Connection, PreparedStatement,
     * and SQL INNER/LEFT JOIN across 3 normalized tables.
     */
    @GetMapping("/raw-jdbc")
    public ResponseEntity<List<Map<String, Object>>> getJoinedTicketsViaRawJdbc(
            @RequestParam(required = false) String status) {
        List<Map<String, Object>> joinedResults = ticketJdbcDao.findTicketsWithJoinedDetailsRawJdbc(status);
        return ResponseEntity.ok(joinedResults);
    }
}
