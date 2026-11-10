-- ===================================================================
-- SRM INSTITUTE OF SCIENCE AND TECHNOLOGY - TASK 4 FULL STACK PROJECT
-- Unit III / CO-3: Relational Database Schema (DDL)
-- Domain: Campus Helpdesk and Maintenance Request System
-- ===================================================================

DROP TABLE IF EXISTS ticket_comments;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS technicians;
DROP TABLE IF EXISTS categories;

-- 1. Helpdesk Maintenance Categories
CREATE TABLE categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    sla_hours INT NOT NULL DEFAULT 24,
    icon VARCHAR(50) DEFAULT 'wrench'
);

-- 2. Campus Maintenance Technicians / Staff
CREATE TABLE technicians (
    technician_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    department VARCHAR(80) NOT NULL,
    active_tickets INT DEFAULT 0,
    available BOOLEAN DEFAULT TRUE
);

-- 3. Maintenance Request Tickets (Core Entity)
CREATE TABLE tickets (
    ticket_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(30) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description CLOB NOT NULL,
    category_id BIGINT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    location VARCHAR(120) NOT NULL,
    requester_name VARCHAR(100) NOT NULL,
    requester_email VARCHAR(120) NOT NULL,
    requester_role VARCHAR(30) NOT NULL DEFAULT 'STUDENT',
    requester_phone VARCHAR(20),
    technician_id BIGINT,
    resolution_notes CLOB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    sla_due_time TIMESTAMP NOT NULL,
    CONSTRAINT fk_ticket_category FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    CONSTRAINT fk_ticket_technician FOREIGN KEY (technician_id) REFERENCES technicians(technician_id) ON DELETE SET NULL
);

-- 4. Ticket Discussion & Resolution Comments (Child Entity)
CREATE TABLE ticket_comments (
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(30) NOT NULL,
    message CLOB NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE
);

-- 5. Audit Trail & State Transitions (CO-3 History Tracking)
CREATE TABLE audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    performed_by VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(255)
);

-- Performance Indexes (CO-3 Optimization)
CREATE INDEX idx_tickets_category ON tickets(category_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_sla ON tickets(sla_due_time);
CREATE INDEX idx_comments_ticket ON ticket_comments(ticket_id);
