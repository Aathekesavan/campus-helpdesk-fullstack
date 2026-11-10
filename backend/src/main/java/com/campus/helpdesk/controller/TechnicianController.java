package com.campus.helpdesk.controller;

import com.campus.helpdesk.model.Technician;
import com.campus.helpdesk.repository.TechnicianRepository;
import com.campus.helpdesk.repository.TicketJdbcDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/technicians")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class TechnicianController {

    private final TechnicianRepository technicianRepository;
    private final TicketJdbcDao ticketJdbcDao;

    @Autowired
    public TechnicianController(TechnicianRepository technicianRepository, TicketJdbcDao ticketJdbcDao) {
        this.technicianRepository = technicianRepository;
        this.ticketJdbcDao = ticketJdbcDao;
    }

    @GetMapping
    public ResponseEntity<List<Technician>> getAllTechnicians(
            @RequestParam(required = false) String department) {
        if (department != null && !department.trim().isEmpty()) {
            return ResponseEntity.ok(technicianRepository.findByDepartment(department.trim()));
        }
        return ResponseEntity.ok(technicianRepository.findAll());
    }

    /**
     * CO-3 / Unit III Dedicated Endpoint:
     * Executes Raw JDBC aggregation query calculating workload distribution across staff.
     */
    @GetMapping("/workload-raw-jdbc")
    public ResponseEntity<List<Map<String, Object>>> getTechnicianWorkloadRawJdbc() {
        return ResponseEntity.ok(ticketJdbcDao.getTechnicianWorkloadAnalysisRawJdbc());
    }
}
