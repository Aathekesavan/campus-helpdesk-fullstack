package com.campus.helpdesk.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AssignTechnicianRequest {

    @NotNull(message = "Technician ID is required")
    private Long technicianId;

    @NotBlank(message = "Assigner identification is required")
    private String assignedBy;

    public AssignTechnicianRequest() {
    }

    public Long getTechnicianId() {
        return technicianId;
    }

    public void setTechnicianId(Long technicianId) {
        this.technicianId = technicianId;
    }

    public String getAssignedBy() {
        return assignedBy;
    }

    public void setAssignedBy(String assignedBy) {
        this.assignedBy = assignedBy;
    }
}
