package com.campus.helpdesk.controller;

import com.campus.helpdesk.dto.DashboardSummaryDTO;
import com.campus.helpdesk.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardSummaryDTO> getDashboardStats() {
        DashboardSummaryDTO stats = dashboardService.getDashboardMetrics();
        return ResponseEntity.ok(stats);
    }
}
