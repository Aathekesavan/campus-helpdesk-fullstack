package com.campus.helpdesk.dto;

import java.time.LocalDateTime;

public class NotificationEventDTO {

    private String eventType;
    private Long ticketId;
    private String ticketNumber;
    private String title;
    private String category;
    private String priority;
    private String requesterEmail;
    private String performedBy;
    private String message;
    private LocalDateTime timestamp;

    public NotificationEventDTO() {
        this.timestamp = LocalDateTime.now();
    }

    public NotificationEventDTO(String eventType, Long ticketId, String ticketNumber, String title,
                                String category, String priority, String requesterEmail,
                                String performedBy, String message) {
        this.eventType = eventType;
        this.ticketId = ticketId;
        this.ticketNumber = ticketNumber;
        this.title = title;
        this.category = category;
        this.priority = priority;
        this.requesterEmail = requesterEmail;
        this.performedBy = performedBy;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public void setRequesterEmail(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
