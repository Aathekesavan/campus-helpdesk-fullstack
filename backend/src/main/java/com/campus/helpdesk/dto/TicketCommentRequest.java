package com.campus.helpdesk.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TicketCommentRequest {

    @NotBlank(message = "Author name is required")
    private String authorName;

    @NotBlank(message = "Author role is required")
    private String authorRole;

    @NotBlank(message = "Comment message cannot be blank")
    @Size(min = 2, max = 2000, message = "Message must be between 2 and 2000 characters")
    private String message;

    private Boolean isInternal = false;

    public TicketCommentRequest() {
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getAuthorRole() {
        return authorRole;
    }

    public void setAuthorRole(String authorRole) {
        this.authorRole = authorRole;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Boolean isInternal) {
        this.isInternal = isInternal;
    }
}
