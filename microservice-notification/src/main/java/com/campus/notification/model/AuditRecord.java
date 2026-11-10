package com.campus.notification.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class AuditRecord {

    private String recordId;
    private String eventType;
    private String ticketNumber;
    private String recipient;
    private String channel; // EMAIL, SMS, PUSH, SLACK
    private String deliveryStatus; // DELIVERED, QUEUED, DISPATCHED
    private String summary;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dispatchedAt;

    public AuditRecord() {
    }

    public AuditRecord(String recordId, String eventType, String ticketNumber, String recipient,
                       String channel, String deliveryStatus, String summary) {
        this.recordId = recordId;
        this.eventType = eventType;
        this.ticketNumber = ticketNumber;
        this.recipient = recipient;
        this.channel = channel;
        this.deliveryStatus = deliveryStatus;
        this.summary = summary;
        this.dispatchedAt = LocalDateTime.now();
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public LocalDateTime getDispatchedAt() {
        return dispatchedAt;
    }

    public void setDispatchedAt(LocalDateTime dispatchedAt) {
        this.dispatchedAt = dispatchedAt;
    }
}
