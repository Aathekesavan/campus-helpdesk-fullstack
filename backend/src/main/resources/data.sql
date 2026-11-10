-- ===================================================================
-- SRM INSTITUTE OF SCIENCE AND TECHNOLOGY - TASK 4 FULL STACK PROJECT
-- Seed Data (DML) for Campus Helpdesk System
-- ===================================================================

-- Categories
INSERT INTO categories (category_id, code, name, description, sla_hours, icon) VALUES
(1, 'IT_SUPPORT', 'IT & Computer Systems', 'Desktop hardware, OS issues, lab peripherals, and software licensing', 8, 'laptop'),
(2, 'ELECTRICAL', 'Electrical & Power', 'Lighting, power outlets, UPS, circuit breakers, and switches', 6, 'zap'),
(3, 'NETWORK', 'Campus Wi-Fi & Network', 'Hostel Wi-Fi, Ethernet ports, DNS issues, and access points', 4, 'wifi'),
(4, 'HVAC', 'HVAC & Air Conditioning', 'Classroom AC units, ventilation, server room climate control', 24, 'wind'),
(5, 'PLUMBING', 'Plumbing & Sanitation', 'Restroom water supply, taps, drain clogs, and water coolers', 12, 'droplet'),
(6, 'FURNITURE', 'Civil & Furniture', 'Desks, lecture hall chairs, doors, window locks, and whiteboards', 48, 'tool');

-- Technicians
INSERT INTO technicians (technician_id, name, email, phone, department, active_tickets, available) VALUES
(1, 'Ramesh Kumar', 'ramesh.k@srmist.edu.in', '+91 98401 23451', 'IT Systems & Services', 2, TRUE),
(2, 'Murugan S', 'murugan.s@srmist.edu.in', '+91 98401 23452', 'Electrical Maintenance', 2, TRUE),
(3, 'Priya Sundaram', 'priya.s@srmist.edu.in', '+91 98401 23453', 'Network Operations Center', 1, TRUE),
(4, 'Anbarasan V', 'anbarasan.v@srmist.edu.in', '+91 98401 23454', 'Civil & Facilities', 1, TRUE),
(5, 'Karthik Raj', 'karthik.r@srmist.edu.in', '+91 98401 23455', 'HVAC & Thermal Services', 1, TRUE);

-- Tickets
INSERT INTO tickets (ticket_id, ticket_number, title, description, category_id, priority, status, location, requester_name, requester_email, requester_role, requester_phone, technician_id, resolution_notes, created_at, updated_at, resolved_at, sla_due_time) VALUES
(1, 'TICK-2026-1001', 'Short circuit spark in CSE Lab 3 Switchboard', 'Intermittent sparking observed when plugging in bench 4 workstation row. Lab sessions disrupted.', 2, 'CRITICAL', 'IN_PROGRESS', 'Tech Park Block 3, 2nd Floor, Lab 304', 'Aathekesavan R', 'ra2411003050015@srmist.edu.in', 'STUDENT', '+91 98765 43210', 2, NULL, DATEADD('HOUR', -5, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP, NULL, DATEADD('HOUR', 1, CURRENT_TIMESTAMP)),

(2, 'TICK-2026-1002', 'High-density Wi-Fi AP offline in Boys Hostel B-Wing', 'AP-B2-04 stopped broadcasting eduroam / campus SSID since morning. 60+ students affected before exams.', 3, 'HIGH', 'ASSIGNED', 'Boys Hostel Block B, 2nd Floor Corridor', 'Lino Joshwa', 'ra2411003050051@srmist.edu.in', 'STUDENT', '+91 98765 43211', 3, NULL, DATEADD('HOUR', -3, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP, NULL, DATEADD('HOUR', 1, CURRENT_TIMESTAMP)),

(3, 'TICK-2026-1003', 'Overhead Projector color distortion in Seminar Hall 1', 'HDMI output shows heavy yellow tint and flickering. Guest lecture scheduled tomorrow at 10 AM.', 1, 'HIGH', 'IN_PROGRESS', 'Main Admin Block, 1st Floor, Seminar Hall 1', 'Dr. P. Hariharan', 'hariharan.p@srmist.edu.in', 'FACULTY', '+91 98400 11223', 1, NULL, DATEADD('HOUR', -4, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP, NULL, DATEADD('HOUR', 4, CURRENT_TIMESTAMP)),

(4, 'TICK-2026-1004', 'Water leakage from central ceiling AC cassette', 'Constant water dripping onto front row study tables in reading zone 2.', 4, 'MEDIUM', 'ASSIGNED', 'Central Library, 2nd Floor Reference Hall', 'Praveen K', 'ra2411003050056@srmist.edu.in', 'STUDENT', '+91 98765 43212', 5, NULL, DATEADD('HOUR', -10, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP, NULL, DATEADD('HOUR', 14, CURRENT_TIMESTAMP)),

(5, 'TICK-2026-1005', 'Continuous tap overflow in 3rd Floor Restroom', 'Main valve loose, causing steady overflow into drainage tray.', 5, 'MEDIUM', 'OPEN', 'Tech Park Block 2, 3rd Floor East Wing', 'Deepak Nathan', 'deepak.n@srmist.edu.in', 'STAFF', '+91 98401 99887', NULL, NULL, DATEADD('HOUR', -2, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP, NULL, DATEADD('HOUR', 10, CURRENT_TIMESTAMP)),

(6, 'TICK-2026-1006', 'Broken lecture hall desk bracket row 5', 'Welding joint cracked on seat 5C; loose metal bracket poses hazard.', 6, 'LOW', 'OPEN', 'Faculty Block B, Hall 201', 'Kavitha R', 'kavitha.r@srmist.edu.in', 'FACULTY', '+91 98401 55443', NULL, NULL, DATEADD('HOUR', -1, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP, NULL, DATEADD('HOUR', 47, CURRENT_TIMESTAMP)),

(7, 'TICK-2026-1007', 'Dual monitor display port faulty on Lab PC 18', 'System boots fine but external display goes to sleep immediately.', 1, 'LOW', 'RESOLVED', 'Basic Engineering Lab, 1st Floor, Room 102', 'Arun Prasath', 'arun.p@srmist.edu.in', 'STUDENT', '+91 98765 12345', 1, 'Replaced faulty DisplayPort to HDMI converter cable. Display verified at 1080p 60Hz.', DATEADD('HOUR', -26, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP, DATEADD('HOUR', -2, CURRENT_TIMESTAMP), DATEADD('HOUR', -18, CURRENT_TIMESTAMP)),

(8, 'TICK-2026-1008', 'Emergency exit corridor emergency light battery dead', 'Inspection revealed emergency backup light not activating upon mains power drop.', 2, 'HIGH', 'RESOLVED', 'PG Block, 4th Floor Emergency Exit Stairwell', 'Security Control Room', 'security@srmist.edu.in', 'STAFF', '+91 98400 99999', 2, 'Replaced internal 12V 7Ah sealed lead-acid battery. Mains fail simulation verified test pass.', DATEADD('HOUR', -30, CURRENT_TIMESTAMP), CURRENT_TIMESTAMP, DATEADD('HOUR', -4, CURRENT_TIMESTAMP), DATEADD('HOUR', -24, CURRENT_TIMESTAMP));

-- Comments
INSERT INTO ticket_comments (comment_id, ticket_id, author_name, author_role, message, is_internal, created_at) VALUES
(1, 1, 'Aathekesavan R', 'STUDENT', 'Technician arrived at 10:15 AM to inspect circuit breaker panel.', FALSE, DATEADD('HOUR', -4, CURRENT_TIMESTAMP)),
(2, 1, 'Murugan S', 'TECHNICIAN', 'Isolated 16A breaker for bench 4. Found loose neutral crimp. Replacing terminal block.', TRUE, DATEADD('HOUR', -3, CURRENT_TIMESTAMP)),
(3, 2, 'Lino Joshwa', 'STUDENT', 'Wi-Fi AP broadcasting SSID again after switch reset. Speed tested at 92 Mbps.', FALSE, DATEADD('HOUR', -2, CURRENT_TIMESTAMP)),
(4, 3, 'Dr. P. Hariharan', 'FACULTY', 'Please ensure test run before 4 PM today.', FALSE, DATEADD('HOUR', -3, CURRENT_TIMESTAMP)),
(5, 4, 'Praveen K', 'STUDENT', 'Technician Karthik inspected drain pan. Water leak contained.', FALSE, DATEADD('HOUR', -2, CURRENT_TIMESTAMP));

-- Audit Logs
INSERT INTO audit_logs (log_id, ticket_id, event_type, old_status, new_status, performed_by, timestamp, notes) VALUES
(1, 1, 'TICKET_CREATED', NULL, 'OPEN', 'Aathekesavan R', DATEADD('HOUR', -5, CURRENT_TIMESTAMP), 'Ticket logged via Campus Helpdesk Web Portal'),
(2, 1, 'STATUS_UPDATED', 'OPEN', 'IN_PROGRESS', 'Murugan S', DATEADD('HOUR', -4, CURRENT_TIMESTAMP), 'Technician accepted dispatch and arrived on-site'),
(3, 2, 'TICKET_CREATED', NULL, 'OPEN', 'Lino Joshwa', DATEADD('HOUR', -3, CURRENT_TIMESTAMP), 'Ticket logged via Campus Helpdesk Web Portal'),
(4, 2, 'TICKET_ASSIGNED', 'OPEN', 'ASSIGNED', 'Admin Desk', DATEADD('HOUR', -3, CURRENT_TIMESTAMP), 'Auto-assigned to Priya Sundaram (NOC Department)'),
(5, 4, 'TICKET_CREATED', NULL, 'OPEN', 'Praveen K', DATEADD('HOUR', -10, CURRENT_TIMESTAMP), 'Ticket logged for Central Library AC issue');
