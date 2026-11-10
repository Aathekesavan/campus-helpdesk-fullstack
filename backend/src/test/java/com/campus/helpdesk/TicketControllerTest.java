package com.campus.helpdesk;

import com.campus.helpdesk.controller.TicketController;
import com.campus.helpdesk.dto.CreateTicketRequest;
import com.campus.helpdesk.model.Category;
import com.campus.helpdesk.model.Priority;
import com.campus.helpdesk.model.Status;
import com.campus.helpdesk.model.Ticket;
import com.campus.helpdesk.repository.TicketJdbcDao;
import com.campus.helpdesk.service.TicketService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TicketController.class)
public class TicketControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TicketService ticketService;

    @MockBean
    private TicketJdbcDao ticketJdbcDao;

    @Test
    @DisplayName("Unit IV / CO-4: GET /api/tickets returns 200 OK and JSON array")
    void testGetAllTickets() throws Exception {
        Category category = new Category(1L, "IT_SUPPORT", "IT & Computer Systems", "Lab Peripherals", 8, "laptop");
        Ticket ticket = new Ticket();
        ticket.setId(1L);
        ticket.setTicketNumber("TICK-2026-1001");
        ticket.setTitle("Projector flickering");
        ticket.setCategory(category);
        ticket.setStatus(Status.OPEN);
        ticket.setPriority(Priority.HIGH);
        ticket.setLocation("Seminar Hall 1");
        ticket.setRequesterName("Dr. P. Hariharan");
        ticket.setRequesterEmail("hariharan.p@srmist.edu.in");
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setSlaDueTime(LocalDateTime.now().plusHours(4));

        when(ticketService.getAllTickets(any(), any(), any(), any())).thenReturn(List.of(ticket));

        mockMvc.perform(get("/api/tickets"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].ticketNumber").value("TICK-2026-1001"))
                .andExpect(jsonPath("$[0].title").value("Projector flickering"))
                .andExpect(jsonPath("$[0].priority").value("HIGH"));
    }

    @Test
    @DisplayName("Unit IV / CO-4: POST /api/tickets with valid payload returns 201 Created")
    void testCreateTicketSuccess() throws Exception {
        CreateTicketRequest req = new CreateTicketRequest();
        req.setTitle("Hostel Wi-Fi down in 3rd floor");
        req.setDescription("All devices unable to obtain IP address from campus DHCP.");
        req.setCategoryId(3L);
        req.setPriority(Priority.HIGH);
        req.setLocation("Boys Hostel Block B Room 310");
        req.setRequesterName("Aathekesavan R");
        req.setRequesterEmail("ra2411003050015@srmist.edu.in");

        Ticket created = new Ticket();
        created.setId(99L);
        created.setTicketNumber("TICK-2026-9999");
        created.setTitle(req.getTitle());
        created.setStatus(Status.OPEN);
        created.setPriority(req.getPriority());
        created.setLocation(req.getLocation());
        created.setRequesterName(req.getRequesterName());
        created.setRequesterEmail(req.getRequesterEmail());
        created.setCreatedAt(LocalDateTime.now());
        created.setSlaDueTime(LocalDateTime.now().plusHours(4));

        when(ticketService.createTicket(any(CreateTicketRequest.class))).thenReturn(created);

        mockMvc.perform(post("/api/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.ticketNumber").value("TICK-2026-9999"))
                .andExpect(jsonPath("$.title").value("Hostel Wi-Fi down in 3rd floor"));
    }

    @Test
    @DisplayName("Unit IV / CO-4: POST /api/tickets with invalid email and empty title returns 400 Bad Request")
    void testCreateTicketValidationError() throws Exception {
        CreateTicketRequest invalidReq = new CreateTicketRequest();
        invalidReq.setTitle(""); // blank title
        invalidReq.setDescription("short"); // too short
        invalidReq.setRequesterEmail("not-an-email"); // invalid email format

        mockMvc.perform(post("/api/tickets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors.title").exists())
                .andExpect(jsonPath("$.fieldErrors.requesterEmail").exists());
    }
}
