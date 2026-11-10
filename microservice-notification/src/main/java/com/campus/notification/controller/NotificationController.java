package com.campus.notification.controller;

import com.campus.notification.model.AuditRecord;
import com.campus.notification.model.NotificationPayload;
import com.campus.notification.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /**
     * Microservice event ingestion endpoint called by the core Helpdesk Backend.
     */
    @PostMapping("/dispatch")
    public ResponseEntity<AuditRecord> dispatchNotification(@Valid @RequestBody NotificationPayload payload) {
        AuditRecord auditRecord = notificationService.processAndDispatch(payload);
        return ResponseEntity.ok(auditRecord);
    }

    /**
     * Audit log endpoint returning history of notifications sent by this microservice.
     */
    @GetMapping("/audit-log")
    public ResponseEntity<List<AuditRecord>> getAuditLog() {
        return ResponseEntity.ok(notificationService.getRecentAuditRecords());
    }

    /**
     * Microservice health status.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealth() {
        return ResponseEntity.ok(notificationService.getMicroserviceHealth());
    }
}
