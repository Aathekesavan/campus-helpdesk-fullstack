package com.campus.notification.service;

import com.campus.notification.model.AuditRecord;
import com.campus.notification.model.NotificationPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedDeque;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final Deque<AuditRecord> auditRecords = new ConcurrentLinkedDeque<>();
    private final AtomicLong counter = new AtomicLong(1000);

    public AuditRecord processAndDispatch(NotificationPayload payload) {
        String recordId = "NOTIF-" + counter.incrementAndGet();
        String channel = "EMAIL";

        // Urgent multi-channel escalation for Critical tickets
        if ("CRITICAL".equalsIgnoreCase(payload.getPriority())) {
            channel = "EMAIL + SMS_DISPATCH + NOC_PAGER";
        } else if ("HIGH".equalsIgnoreCase(payload.getPriority())) {
            channel = "EMAIL + PUSH_NOTIFICATION";
        }

        String summary = String.format("[%s] Event '%s' on %s (Priority: %s). %s",
                channel, payload.getEventType(), payload.getTicketNumber(),
                payload.getPriority(), payload.getMessage());

        log.info("================================================================================");
        log.info(">>> [MICROSERVICE EVENT RECEIVED] Record: {}", recordId);
        log.info(">>> Ticket: {} | Priority: {} | Requester: {}", payload.getTicketNumber(), payload.getPriority(), payload.getRequesterEmail());
        log.info(">>> Dispatch Channels: [{}]", channel);
        log.info(">>> Notification Content: {}", payload.getMessage());
        log.info("================================================================================");

        AuditRecord record = new AuditRecord(
                recordId,
                payload.getEventType(),
                payload.getTicketNumber(),
                payload.getRequesterEmail(),
                channel,
                "DELIVERED",
                summary
        );

        auditRecords.addFirst(record);

        // Maintain fixed memory limit
        while (auditRecords.size() > 100) {
            auditRecords.removeLast();
        }

        return record;
    }

    public List<AuditRecord> getRecentAuditRecords() {
        return new ArrayList<>(auditRecords);
    }

    public Map<String, Object> getMicroserviceHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "notification-sla-service");
        health.put("port", 8085);
        health.put("totalDispatched", counter.get() - 1000);
        health.put("auditQueueDepth", auditRecords.size());
        health.put("supportedChannels", List.of("SMTP_EMAIL", "CAMPUS_SMS_GATEWAY", "NOC_PAGER_ALERT"));
        return health;
    }
}
