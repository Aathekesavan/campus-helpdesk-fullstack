package com.campus.helpdesk.model;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "technicians")
public class Technician implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "technician_id")
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 120)
    private String email;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "department", nullable = false, length = 80)
    private String department;

    @Column(name = "active_tickets")
    private Integer activeTickets = 0;

    @Column(name = "available")
    private Boolean available = true;

    public Technician() {
    }

    public Technician(Long id, String name, String email, String phone, String department, Integer activeTickets, Boolean available) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.activeTickets = activeTickets;
        this.available = available;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getActiveTickets() {
        return activeTickets;
    }

    public void setActiveTickets(Integer activeTickets) {
        this.activeTickets = activeTickets;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}
