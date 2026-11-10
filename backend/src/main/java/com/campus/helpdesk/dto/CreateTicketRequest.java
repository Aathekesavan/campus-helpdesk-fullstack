package com.campus.helpdesk.dto;

import com.campus.helpdesk.model.Priority;
import com.campus.helpdesk.model.UserRole;
import jakarta.validation.constraints.*;

public class CreateTicketRequest {

    @NotBlank(message = "Title is required and cannot be blank")
    @Size(min = 5, max = 150, message = "Title must be between 5 and 150 characters")
    private String title;

    @NotBlank(message = "Description of the maintenance issue is required")
    @Size(min = 10, max = 2000, message = "Description must provide at least 10 characters of detail")
    private String description;

    @NotNull(message = "Category selection is required")
    private Long categoryId;

    @NotNull(message = "Priority level is required (LOW, MEDIUM, HIGH, CRITICAL)")
    private Priority priority = Priority.MEDIUM;

    @NotBlank(message = "Location/room details are required")
    @Size(min = 3, max = 120, message = "Location must be between 3 and 120 characters")
    private String location;

    @NotBlank(message = "Requester name is required")
    @Size(min = 2, max = 100, message = "Requester name must be valid")
    private String requesterName;

    @NotBlank(message = "Requester institutional email is required")
    @Email(message = "Please provide a valid institutional email address")
    private String requesterEmail;

    @NotNull(message = "Requester role is required (STUDENT, FACULTY, STAFF)")
    private UserRole requesterRole = UserRole.STUDENT;

    @Pattern(regexp = "^$|^[+0-9\\s\\-]{7,20}$", message = "Phone number must be a valid contact number")
    private String requesterPhone;

    public CreateTicketRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public void setRequesterEmail(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }

    public UserRole getRequesterRole() {
        return requesterRole;
    }

    public void setRequesterRole(UserRole requesterRole) {
        this.requesterRole = requesterRole;
    }

    public String getRequesterPhone() {
        return requesterPhone;
    }

    public void setRequesterPhone(String requesterPhone) {
        this.requesterPhone = requesterPhone;
    }
}
