package com.campus.helpdesk.service;

import com.campus.helpdesk.dto.NotificationEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Service demonstrating Inter-Service REST API Boundary / Microservice Integration (CO-5).
 * Dispatches notification events to the standalone Notification & SLA Microservice.
 */
@Service
public class NotificationClientService {

    private static final Logger log = LoggerFactory.getLogger(NotificationClientService.class);

    private final RestTemplate restTemplate;

    @Value("${microservice.notification.url:http://localhost:8085/api/notifications/dispatch}")
    private String notificationServiceUrl;

    public NotificationClientService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(2000))
                .setReadTimeout(Duration.ofMillis(3000))
                .build();
    }

    /**
     * Dispatches notification event to the separate microservice boundary.
     * Includes graceful fallback to prevent downstream outages from blocking helpdesk operations.
     */
    public boolean sendNotificationEvent(NotificationEventDTO event) {
        try {
            log.info("--> [INTER-SERVICE DISPATCH] Sending event [{}] for ticket [{}] to Notification Microservice at {}",
                    event.getEventType(), event.getTicketNumber(), notificationServiceUrl);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<NotificationEventDTO> requestEntity = new HttpEntity<>(event, headers);

            restTemplate.postForObject(notificationServiceUrl, requestEntity, String.class);
            log.info("<-- [INTER-SERVICE SUCCESS] Notification successfully ingested by microservice.");
            return true;
        } catch (Exception e) {
            log.warn("[INTER-SERVICE DEGRADED] Notification microservice unreachable at {}. Error: {}. System operating in resilient standalone mode.",
                    notificationServiceUrl, e.getMessage());
            return false;
        }
    }
}
