# Campus Helpdesk & Maintenance Request System

**Course:** 21CSE354T — Full Stack Web Development  
**Assessment:** Task 4 — Capstone Team Project Assignment  
**Problem Statement Selected:** **Topic 1 — Campus Helpdesk and Maintenance Request System**  
**Submission Deadline:** 10.11.2026 (PPT Presentation & Full Project Package)  
**Institution:** SRM Institute of Science and Technology, Tiruchirappalli Campus  
**Department:** Computer Science and Engineering  
**Faculty In-Charge:** Dr. P. Hariharan, AP, CSE  

---

## 1. Executive Summary & Problem Statement

Campuses typically manage maintenance requests (electrical faults, lab PC issues, Wi-Fi outages, AC leaks, and civil repairs) using disjointed paper registers, verbal complaints, or messaging groups. This manual approach results in:
- Unfulfilled repair requests due to untracked SLAs.
- Bottlenecks in technician assignment with zero visibility into staff workloads.
- Duplicate entries and zero transparency for students and faculty regarding resolution progress.

The **Campus Helpdesk & Maintenance Request System** solves this by delivering an end-to-end, full-stack digital platform:
1. **Student & Faculty Self-Service Portal:** Submit tickets with structured category selection, room location, priority, and problem description.
2. **Automated SLA Engine:** Computes dynamic resolution deadlines based on category baseline SLA and priority multipliers (Critical: 25% duration, High: 50%, Medium: 100%, Low: 150%).
3. **Smart Technician Auto-Assignment:** Heuristic dispatcher assigns incoming tickets to available staff with the minimum active workload in that department.
4. **Interactive Lifecycle & Discussion Stepper:** Visual tracking from `OPEN` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`, with two-way technician comments and internal notes.
5. **Decoupled Microservice:** Non-blocking event dispatch to an autonomous **Notification & SLA Compliance Microservice (Port 8085)**.

---

## 2. Team Member Roles & Contribution Breakdown (3 Members)

| Member | Register Number | Role Assignment | Syllabus Focus | Bloom's Level |
| :--- | :---: | :--- | :--- | :---: |
| **Aathekesavan R (Lead)** | `RA2411003050015` | **Team Coordinator & Lead Backend/Database Architect**<br>• System topology, REST API contracts & DTOs<br>• 3NF Relational SQL schema, DDL/DML, indexes<br>• Spring Boot Controller-Service-Repository architecture<br>• Classic Raw JDBC DAO with 3-table SQL join & parameters | **CO-3, CO-4, CO-5** | **K6 (Create)** |
| **Lino Joshwa** | `RA2411003050051` | **Frontend Engineer & UI/UX Specialist**<br>• React 18 Single Page Application with Vite<br>• 4 responsive views: Dashboard, Tickets, Detail, Staff<br>• StatusStepper, CategoryPills & CreateTicketModal<br>• Client validation, responsive grid, CSS design tokens | **CO-1, CO-2** | **K5 (Evaluate)** |
| **Praveen K** | `RA2411003050056` | **Microservice, Testing & Deployment Engineer**<br>• Autonomous Notification & SLA Microservice (Port 8085)<br>• Inter-service REST template communication with timeouts<br>• JUnit 5 & MockMvc unit/integration test suites<br>• Startup batch scripts, Docker compose orchestration | **CO-4, CO-5** | **K5 (Evaluate)** |

---

## 3. Syllabus Topic & Course Outcome (CO) Mapping

| Course Outcome | Syllabus Topic | Minimum Expected Evidence | Task 4 Implementation Evidence |
| :--- | :--- | :--- | :--- |
| **CO-1 (Unit I)** | HTML structure, fonts, lists, tables, links, images; CSS box model, layout, backgrounds, transitions | Well-structured pages, navigation, tables, consistent CSS styling and responsive layout. | Semantic HTML5 structure, CSS variables design system (`--color-primary: #1b365d`), responsive data tables, animated badges, mobile layout. |
| **CO-2 (Unit II)** | JavaScript, DOM, events, React JSX, components, forms, routing, hooks (`useState`, `useEffect`) | Reusable React UI, forms, validation, routing, hooks. | Modular React 18 components (`Navbar`, `StatCard`, `StatusStepper`), `useState`/`useEffect` hooks, real-time client validation, search filters. |
| **CO-3 (Unit III)** | SQL selection, joins, set queries, subqueries, CRUD; JDBC `Connection`, `DriverManager`, `Statement`, `ResultSet` | Relational schema, CRUD operations, related-record queries, and JDBC connectivity concepts. | 3NF SQL schema across 5 tables, foreign keys, `TicketJdbcDao` executing raw JDBC 3-table `INNER JOIN`/`LEFT JOIN` query and workload aggregation. |
| **CO-4 (Unit IV)** | Spring Boot basics, development setup, auto-configuration, 3-tier architecture, business layer, testing | Spring Boot app with controller, service, domain layers; tests for important behavior. | Layered Spring Boot 3.2 app, `@RestControllerAdvice` error handling, SLA calculation business logic, JUnit 5 service test and `MockMvc` controller tests. |
| **CO-5 (Unit V)** | Data model, JPA, entities, repositories; microservices architecture and service/UI integration | JPA entities/repositories, separate service/API boundary or microservice integrated with UI. | JPA `@Entity` relationships, dynamic multi-criteria `@Query`, plus separate **Notification Microservice (Port 8085)** integrated via REST template. |

---

## 4. System Architecture & Port Registry

```
                         ┌─────────────────────────────────────────────────────────┐
                         │               React 18 Single Page Client               │
                         │                 (http://localhost:5173)                 │
                         └────────────────────────────┬────────────────────────────┘
                                                      │ REST JSON
                                                      ▼
                         ┌─────────────────────────────────────────────────────────┐
                         │          Core Spring Boot Backend API (Port: 8080)       │
                         ├─────────────────────────────────────────────────────────┤
                         │  • Presentation Layer: TicketController, DashboardCtrl  │
                         │  • Business Logic:     TicketServiceImpl, SLA Engine    │
                         │  • Data Access:        TicketRepository (Spring JPA)    │
                         │  • Raw JDBC Layer:     TicketJdbcDao (Unit III CO-3)    │
                         └──────────────┬───────────────────────────┬──────────────┘
                                        │                           │
                   Direct SQL Relational│                           │HTTP POST REST Event
                                        ▼                           ▼
                         ┌───────────────────────┐    ┌────────────────────────────┐
                         │   Embedded H2 SQL DB  │    │  Notification Microservice │
                         │ (jdbc:h2:mem:helpdesk)│    │        (Port: 8085)        │
                         ├───────────────────────┤    ├────────────────────────────┤
                         │ • categories          │    │ • Dynamic Multi-Channel    │
                         │ • technicians         │    │   (Email / SMS / Pager)    │
                         │ • tickets             │    │ • In-Memory Audit Buffer   │
                         │ • ticket_comments     │    │ • Autonomous Health API    │
                         │ • audit_logs          │    └────────────────────────────┘
                         └───────────────────────┘
```

### Port Registry

| Component | Port | Base URL / Path | Responsibilities |
| :--- | :---: | :--- | :--- |
| **Frontend Client** | `5173` | `http://localhost:5173` | React SPA: Dashboard, Tickets, Detail, Staff |
| **Core Backend** | `8080` | `http://localhost:8080/api/tickets` | Core CRUD, SLA computation, JPA & Raw JDBC |
| **H2 Web Console** | `8080` | `http://localhost:8080/h2-console` | Relational table visualizer (`jdbc:h2:mem:helpdeskdb`) |
| **Notification Microservice** | `8085` | `http://localhost:8085/api/notifications` | Standalone SLA Alert & Escalation Service |

---

## 5. Relational Database Schema (Unit III / CO-3)

The database schema is normalized to **3NF** across 5 relational tables:

1. **`categories`**: Defines maintenance categories (`IT_SUPPORT`, `ELECTRICAL`, `NETWORK`, `HVAC`, `PLUMBING`, `FURNITURE`) with baseline SLA durations and icons.
2. **`technicians`**: Stores staff technicians, departmental affiliations, phone numbers, and dynamic active ticket counters.
3. **`tickets`**: Primary maintenance request entity with tracking code (`TICK-2026-XXXX`), title, room location, priority, lifecycle status, dynamic SLA due timestamp, and foreign keys to category and technician.
4. **`ticket_comments`**: Child table with `ON DELETE CASCADE` storing two-way communication, progress updates, and internal technician diagnostic notes.
5. **`audit_logs`**: Historical audit trail capturing every state transition (`old_status` $\rightarrow$ `new_status`), timestamp, and actor.

---

## 6. Classic Raw JDBC Implementation (TicketJdbcDao)

To provide explicit syllabus evidence for **Unit III / CO-3**, the application contains `TicketJdbcDao.java`:
- Obtains explicit `java.sql.Connection` from `DataSource`.
- Binds filter parameters via `PreparedStatement.setString()` to prevent SQL injection.
- Executes a **3-Table SQL JOIN query**:
  ```sql
  SELECT t.ticket_id, t.ticket_number, t.title, t.priority, t.status,
         t.location, t.requester_name, t.sla_due_time,
         c.name AS category_name, c.sla_hours,
         tech.name AS technician_name, tech.phone AS technician_phone
  FROM tickets t
  INNER JOIN categories c ON t.category_id = c.category_id
  LEFT JOIN technicians tech ON t.technician_id = tech.technician_id
  WHERE (? IS NULL OR t.status = ?)
  ORDER BY t.created_at DESC;
  ```
- Traverses `ResultSet` rows and maps records into structured data.
- Live endpoint available at: `GET http://localhost:8080/api/tickets/raw-jdbc`.

---

## 7. Autonomous Microservice Architecture (Unit V / CO-5)

The **Notification & SLA Compliance Microservice** is completely decoupled:
- Runs as an independent JVM application on port `8085`.
- Ingests events asynchronously via `POST /api/notifications/dispatch`.
- Evaluates urgency dynamically:
  - **CRITICAL**: Dispatches `EMAIL + SMS_DISPATCH + NOC_PAGER`.
  - **HIGH**: Dispatches `EMAIL + PUSH_NOTIFICATION`.
  - **MEDIUM / LOW**: Standard `EMAIL` confirmation.
- Resilient Inter-Service Integration: The core backend uses `RestTemplate` with 2-second timeout safeguards; if the microservice is temporarily stopped, core ticketing operations continue uninterrupted in graceful degraded mode.

---

## 8. How to Run the Application

### Method 1: One-Click Windows Launcher (Recommended)
Double-click [`start-helpdesk.bat`](file:///d:/FS%20asi/task-4-campus-helpdesk/start-helpdesk.bat).  
It will automatically launch:
1. Core Spring Boot Backend (Port 8080)
2. Notification Microservice (Port 8085)
3. React Vite Frontend Client (Port 5173)

### Method 2: Running Locally via Terminal Commands

**Terminal 1 — Core Backend:**
```powershell
cd "d:\FS asi\task-4-campus-helpdesk\backend"
mvn spring-boot:run
```

**Terminal 2 — Notification Microservice:**
```powershell
cd "d:\FS asi\task-4-campus-helpdesk\microservice-notification"
mvn spring-boot:run
```

**Terminal 3 — React Frontend Client:**
```powershell
cd "d:\FS asi\task-4-campus-helpdesk\frontend"
npx vite --host 0.0.0.0 --port 5173
```

### Method 3: Docker Compose
```powershell
cd "d:\FS asi\task-4-campus-helpdesk"
docker compose up --build
```

---

## 9. Verification & Testing Journey

1. Open `http://localhost:5173` in any browser.
2. Inspect the **Dashboard**: View active KPI stats, category progress bars, and recent tickets.
3. Click **"➕ Report Issue"**:
   - Test client validation by attempting to submit with empty fields.
   - Enter: Title: *"Overheating switch in CSE Server Rack"*, Category: *Electrical*, Priority: *Critical*, Location: *Tech Park Block 1 Room 101*.
   - Submit and observe immediate calculation of 2-hour SLA deadline, heuristic assignment to Murugan S, and toast alert.
4. Click on the ticket in the table to open **Ticket Details**:
   - Inspect the **Status Stepper** (`Reported` $\rightarrow$ `Assigned`).
   - Add a comment or technician diagnostic note.
   - Click *"Mark Issue as Resolved"*, input resolution notes, and confirm.
   - Notice the status updates to `RESOLVED` and the technician's active workload decreases.
5. Click **"Staff Technicians"**: Verify real-time queue workloads for campus maintenance technicians.
6. Click **"Notification Microservice"**: View the ingested event log on Port 8085 showing SMS and Email dispatch records.
7. Open `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:helpdeskdb`, User: `sa`, Password: `blank`) and run `SELECT * FROM tickets;` to inspect relational records.

---

## 10. Deliverables Directory Summary

- Presentation Slide Deck: [`Task_4_Campus_Helpdesk_Presentation.pptx`](file:///d:/FS%20asi/Task_4_Campus_Helpdesk_Presentation.pptx)
- Comprehensive Word Report: [`Task_4_Campus_Helpdesk_Project_Report_AK.docx`](file:///d:/FS%20asi/Task_4_Campus_Helpdesk_Project_Report_AK.docx)
- Comprehensive PDF Report: [`Task_4_Campus_Helpdesk_Project_Report_AK.pdf`](file:///d:/FS%20asi/Task_4_Campus_Helpdesk_Project_Report_AK.pdf)
- Core Backend Source: [`backend/`](file:///d:/FS%20asi/task-4-campus-helpdesk/backend/)
- Microservice Source: [`microservice-notification/`](file:///d:/FS%20asi/task-4-campus-helpdesk/microservice-notification/)
- React Frontend Source: [`frontend/`](file:///d:/FS%20asi/task-4-campus-helpdesk/frontend/)
