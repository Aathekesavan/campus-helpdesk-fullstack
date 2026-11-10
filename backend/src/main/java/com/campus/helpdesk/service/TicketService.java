package com.campus.helpdesk.service;

import com.campus.helpdesk.dto.AssignTechnicianRequest;
import com.campus.helpdesk.dto.CreateTicketRequest;
import com.campus.helpdesk.dto.TicketCommentRequest;
import com.campus.helpdesk.dto.UpdateTicketStatusRequest;
import com.campus.helpdesk.model.*;

import java.util.List;

public interface TicketService {

    List<Ticket> getAllTickets(Status status, Priority priority, Long categoryId, String search);

    Ticket getTicketById(Long id);

    Ticket getTicketByNumber(String ticketNumber);

    Ticket createTicket(CreateTicketRequest req);

    Ticket updateTicketStatus(Long id, UpdateTicketStatusRequest req);

    Ticket assignTechnician(Long id, AssignTechnicianRequest req);

    void deleteTicket(Long id);

    TicketComment addComment(Long ticketId, TicketCommentRequest req);

    List<TicketComment> getComments(Long ticketId);

    List<AuditLog> getAuditLogs(Long ticketId);
}
