// ===================================================================
// SRM CAMPUS HELPDESK — API SERVICE CLIENT (CO-2 & CO-5)
// Connects to Spring Boot Backend (8080) & Microservice (8085)
// Includes Resilient Fallback Store for Standalone Evaluation
// ===================================================================

const BACKEND_BASE = 'http://localhost:8080/api';
const NOTIFICATION_BASE = 'http://localhost:8085/api/notifications';

// Initial Mock Seed Dataset (Campus Reality)
let localCategories = [
  { id: 1, code: 'IT_SUPPORT', name: 'IT & Computer Systems', description: 'Desktop hardware, OS, lab peripherals', slaHours: 8, icon: '💻' },
  { id: 2, code: 'ELECTRICAL', name: 'Electrical & Power', description: 'Lighting, power outlets, UPS, circuit breakers', slaHours: 6, icon: '⚡' },
  { id: 3, code: 'NETWORK', name: 'Campus Wi-Fi & Network', description: 'Hostel Wi-Fi, Ethernet, DNS issues', slaHours: 4, icon: '📶' },
  { id: 4, code: 'HVAC', name: 'HVAC & Air Conditioning', description: 'Classroom AC units, server room climate', slaHours: 24, icon: '❄️' },
  { id: 5, code: 'PLUMBING', name: 'Plumbing & Sanitation', description: 'Restroom water supply, taps, drain clogs', slaHours: 12, icon: '💧' },
  { id: 6, code: 'FURNITURE', name: 'Civil & Furniture', description: 'Desks, lecture hall chairs, window locks', slaHours: 48, icon: '🪑' }
];

let localTechnicians = [
  { id: 1, name: 'Ramesh Kumar', email: 'ramesh.k@srmist.edu.in', phone: '+91 98401 23451', department: 'IT Systems & Services', activeTickets: 2, available: true },
  { id: 2, name: 'Murugan S', email: 'murugan.s@srmist.edu.in', phone: '+91 98401 23452', department: 'Electrical Maintenance', activeTickets: 2, available: true },
  { id: 3, name: 'Priya Sundaram', email: 'priya.s@srmist.edu.in', phone: '+91 98401 23453', department: 'Network Operations Center', activeTickets: 1, available: true },
  { id: 4, name: 'Anbarasan V', email: 'anbarasan.v@srmist.edu.in', phone: '+91 98401 23454', department: 'Civil & Facilities', activeTickets: 1, available: true },
  { id: 5, name: 'Karthik Raj', email: 'karthik.r@srmist.edu.in', phone: '+91 98401 23455', department: 'HVAC & Thermal Services', activeTickets: 1, available: true }
];

let localTickets = [
  {
    id: 1,
    ticketNumber: 'TICK-2026-1001',
    title: 'Short circuit spark in CSE Lab 3 Switchboard',
    description: 'Intermittent sparking observed when plugging in bench 4 workstation row. Lab sessions disrupted.',
    category: localCategories[1],
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    location: 'Tech Park Block 3, 2nd Floor, Lab 304',
    requesterName: 'Aathekesavan R',
    requesterEmail: 'ra2411003050015@srmist.edu.in',
    requesterRole: 'STUDENT',
    requesterPhone: '+91 98765 43210',
    technician: localTechnicians[1],
    resolutionNotes: null,
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    slaDueTime: new Date(Date.now() + 1 * 3600000).toISOString()
  },
  {
    id: 2,
    ticketNumber: 'TICK-2026-1002',
    title: 'High-density Wi-Fi AP offline in Boys Hostel B-Wing',
    description: 'AP-B2-04 stopped broadcasting eduroam / campus SSID since morning. 60+ students affected before exams.',
    category: localCategories[2],
    priority: 'HIGH',
    status: 'ASSIGNED',
    location: 'Boys Hostel Block B, 2nd Floor Corridor',
    requesterName: 'Lino Joshwa',
    requesterEmail: 'ra2411003050051@srmist.edu.in',
    requesterRole: 'STUDENT',
    requesterPhone: '+91 98765 43211',
    technician: localTechnicians[2],
    resolutionNotes: null,
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    slaDueTime: new Date(Date.now() + 1 * 3600000).toISOString()
  },
  {
    id: 3,
    ticketNumber: 'TICK-2026-1003',
    title: 'Overhead Projector color distortion in Seminar Hall 1',
    description: 'HDMI output shows heavy yellow tint and flickering. Guest lecture scheduled tomorrow at 10 AM.',
    category: localCategories[0],
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    location: 'Main Admin Block, 1st Floor, Seminar Hall 1',
    requesterName: 'Dr. P. Hariharan',
    requesterEmail: 'hariharan.p@srmist.edu.in',
    requesterRole: 'FACULTY',
    requesterPhone: '+91 98400 11223',
    technician: localTechnicians[0],
    resolutionNotes: null,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    slaDueTime: new Date(Date.now() + 4 * 3600000).toISOString()
  },
  {
    id: 4,
    ticketNumber: 'TICK-2026-1004',
    title: 'Water leakage from central ceiling AC cassette',
    description: 'Constant water dripping onto front row study tables in reading zone 2.',
    category: localCategories[3],
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    location: 'Central Library, 2nd Floor Reference Hall',
    requesterName: 'Praveen K',
    requesterEmail: 'ra2411003050056@srmist.edu.in',
    requesterRole: 'STUDENT',
    requesterPhone: '+91 98765 43212',
    technician: localTechnicians[4],
    resolutionNotes: null,
    createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    slaDueTime: new Date(Date.now() + 14 * 3600000).toISOString()
  },
  {
    id: 5,
    ticketNumber: 'TICK-2026-1005',
    title: 'Continuous tap overflow in 3rd Floor Restroom',
    description: 'Main valve loose, causing steady overflow into drainage tray.',
    category: localCategories[4],
    priority: 'MEDIUM',
    status: 'OPEN',
    location: 'Tech Park Block 2, 3rd Floor East Wing',
    requesterName: 'Deepak Nathan',
    requesterEmail: 'deepak.n@srmist.edu.in',
    requesterRole: 'STAFF',
    requesterPhone: '+91 98401 99887',
    technician: null,
    resolutionNotes: null,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    slaDueTime: new Date(Date.now() + 10 * 3600000).toISOString()
  },
  {
    id: 6,
    ticketNumber: 'TICK-2026-1006',
    title: 'Broken lecture hall desk bracket row 5',
    description: 'Welding joint cracked on seat 5C; loose metal bracket poses hazard.',
    category: localCategories[5],
    priority: 'LOW',
    status: 'OPEN',
    location: 'Faculty Block B, Hall 201',
    requesterName: 'Kavitha R',
    requesterEmail: 'kavitha.r@srmist.edu.in',
    requesterRole: 'FACULTY',
    requesterPhone: '+91 98401 55443',
    technician: null,
    resolutionNotes: null,
    createdAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    slaDueTime: new Date(Date.now() + 47 * 3600000).toISOString()
  },
  {
    id: 7,
    ticketNumber: 'TICK-2026-1007',
    title: 'Dual monitor display port faulty on Lab PC 18',
    description: 'System boots fine but external display goes to sleep immediately.',
    category: localCategories[0],
    priority: 'LOW',
    status: 'RESOLVED',
    location: 'Basic Engineering Lab, 1st Floor, Room 102',
    requesterName: 'Arun Prasath',
    requesterEmail: 'arun.p@srmist.edu.in',
    requesterRole: 'STUDENT',
    requesterPhone: '+91 98765 12345',
    technician: localTechnicians[0],
    resolutionNotes: 'Replaced faulty DisplayPort to HDMI converter cable. Display verified at 1080p 60Hz.',
    createdAt: new Date(Date.now() - 26 * 3600000).toISOString(),
    slaDueTime: new Date(Date.now() - 18 * 3600000).toISOString()
  }
];

let localComments = {
  1: [
    { id: 1, authorName: 'Aathekesavan R', authorRole: 'STUDENT', message: 'Technician arrived at 10:15 AM to inspect circuit breaker panel.', isInternal: false, createdAt: new Date(Date.now() - 4 * 3600000).toISOString() },
    { id: 2, authorName: 'Murugan S', authorRole: 'TECHNICIAN', message: 'Isolated 16A breaker for bench 4. Found loose neutral crimp. Replacing terminal block.', isInternal: true, createdAt: new Date(Date.now() - 3 * 3600000).toISOString() }
  ],
  2: [
    { id: 3, authorName: 'Lino Joshwa', authorRole: 'STUDENT', message: 'Wi-Fi AP broadcasting SSID again after switch reset. Speed tested at 92 Mbps.', isInternal: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() }
  ],
  3: [
    { id: 4, authorName: 'Dr. P. Hariharan', authorRole: 'FACULTY', message: 'Please ensure test run before 4 PM today.', isInternal: false, createdAt: new Date(Date.now() - 3 * 3600000).toISOString() }
  ],
  4: [
    { id: 5, authorName: 'Praveen K', authorRole: 'STUDENT', message: 'Technician Karthik inspected drain pan. Water leak contained.', isInternal: false, createdAt: new Date(Date.now() - 2 * 3600000).toISOString() }
  ]
};

let localAuditRecords = [
  { recordId: 'NOTIF-1001', eventType: 'TICKET_CREATED', ticketNumber: 'TICK-2026-1001', recipient: 'ra2411003050015@srmist.edu.in', channel: 'EMAIL + SMS_DISPATCH + NOC_PAGER', deliveryStatus: 'DELIVERED', summary: 'Critical short circuit ticket alert dispatched to student & NOC engineer.', dispatchedAt: new Date(Date.now() - 5 * 3600000).toISOString() },
  { recordId: 'NOTIF-1002', eventType: 'TICKET_ASSIGNED', ticketNumber: 'TICK-2026-1001', recipient: 'murugan.s@srmist.edu.in', channel: 'SMS_DISPATCH', deliveryStatus: 'DELIVERED', summary: 'Technician Murugan S dispatched to Tech Park Lab 304.', dispatchedAt: new Date(Date.now() - 4.5 * 3600000).toISOString() },
  { recordId: 'NOTIF-1003', eventType: 'TICKET_CREATED', ticketNumber: 'TICK-2026-1002', recipient: 'ra2411003050051@srmist.edu.in', channel: 'EMAIL + PUSH_NOTIFICATION', deliveryStatus: 'DELIVERED', summary: 'High priority Wi-Fi AP offline notification sent.', dispatchedAt: new Date(Date.now() - 3 * 3600000).toISOString() }
];

export const HelpdeskAPI = {
  isBackendOnline: false,

  // Check health of backend
  async checkHealth() {
    try {
      const res = await fetch(`${BACKEND_BASE}/categories`, { method: 'GET', signal: AbortSignal.timeout(1200) });
      this.isBackendOnline = res.ok;
      return res.ok;
    } catch {
      this.isBackendOnline = false;
      return false;
    }
  },

  // Fetch Categories
  async getCategories() {
    try {
      const res = await fetch(`${BACKEND_BASE}/categories`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        this.isBackendOnline = true;
        return await res.json();
      }
    } catch {
      // Fallback
    }
    this.isBackendOnline = false;
    return localCategories;
  },

  // Fetch Technicians
  async getTechnicians() {
    try {
      const res = await fetch(`${BACKEND_BASE}/technicians`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        this.isBackendOnline = true;
        return await res.json();
      }
    } catch {
      // Fallback
    }
    this.isBackendOnline = false;
    return localTechnicians;
  },

  // Fetch Tickets with filters
  async getTickets(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);
      if (filters.priority && filters.priority !== 'ALL') params.append('priority', filters.priority);
      if (filters.categoryId && filters.categoryId !== 'ALL') params.append('categoryId', filters.categoryId);
      if (filters.search) params.append('search', filters.search);

      const url = `${BACKEND_BASE}/tickets${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        this.isBackendOnline = true;
        return await res.json();
      }
    } catch {
      // Fallback
    }
    this.isBackendOnline = false;

    // Filter local mock tickets
    return localTickets.filter(t => {
      if (filters.status && filters.status !== 'ALL' && t.status !== filters.status) return false;
      if (filters.priority && filters.priority !== 'ALL' && t.priority !== filters.priority) return false;
      if (filters.categoryId && filters.categoryId !== 'ALL' && t.category?.id !== Number(filters.categoryId)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchNum = t.ticketNumber.toLowerCase().includes(q);
        const matchLoc = t.location.toLowerCase().includes(q);
        const matchReq = t.requesterName.toLowerCase().includes(q);
        if (!matchTitle && !matchNum && !matchLoc && !matchReq) return false;
      }
      return true;
    });
  },

  // Fetch single ticket
  async getTicketById(id) {
    try {
      const res = await fetch(`${BACKEND_BASE}/tickets/${id}`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return localTickets.find(t => t.id === Number(id)) || null;
  },

  // Create ticket
  async createTicket(ticketData) {
    try {
      const res = await fetch(`${BACKEND_BASE}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        this.isBackendOnline = true;
        return await res.json();
      }
    } catch {
      // Fallback
    }

    this.isBackendOnline = false;
    const cat = localCategories.find(c => c.id === Number(ticketData.categoryId)) || localCategories[0];
    const newId = localTickets.length + 1;
    const newTicket = {
      id: newId,
      ticketNumber: `TICK-2026-${1000 + newId}`,
      title: ticketData.title,
      description: ticketData.description,
      category: cat,
      priority: ticketData.priority || 'MEDIUM',
      status: 'OPEN',
      location: ticketData.location,
      requesterName: ticketData.requesterName,
      requesterEmail: ticketData.requesterEmail,
      requesterRole: ticketData.requesterRole || 'STUDENT',
      requesterPhone: ticketData.requesterPhone,
      technician: null,
      resolutionNotes: null,
      createdAt: new Date().toISOString(),
      slaDueTime: new Date(Date.now() + cat.slaHours * 3600000).toISOString()
    };

    localTickets = [newTicket, ...localTickets];

    // Mock microservice event
    localAuditRecords.unshift({
      recordId: `NOTIF-${1000 + localAuditRecords.length + 1}`,
      eventType: 'TICKET_CREATED',
      ticketNumber: newTicket.ticketNumber,
      recipient: newTicket.requesterEmail,
      channel: newTicket.priority === 'CRITICAL' ? 'EMAIL + SMS_DISPATCH + NOC_PAGER' : 'EMAIL',
      deliveryStatus: 'DELIVERED',
      summary: `Ticket ${newTicket.ticketNumber} logged for ${cat.name}. SLA due in ${cat.slaHours} hours.`,
      dispatchedAt: new Date().toISOString()
    });

    return newTicket;
  },

  // Update status
  async updateStatus(id, newStatus, performedBy, resolutionNotes) {
    try {
      const res = await fetch(`${BACKEND_BASE}/tickets/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, performedBy, resolutionNotes }),
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const t = localTickets.find(x => x.id === Number(id));
    if (t) {
      t.status = newStatus;
      if (resolutionNotes) t.resolutionNotes = resolutionNotes;
      if (newStatus === 'RESOLVED' || newStatus === 'CLOSED') {
        t.resolvedAt = new Date().toISOString();
      }
    }
    return t;
  },

  // Assign technician
  async assignTechnician(ticketId, technicianId, assignedBy) {
    try {
      const res = await fetch(`${BACKEND_BASE}/tickets/${ticketId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ technicianId, assignedBy }),
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const t = localTickets.find(x => x.id === Number(ticketId));
    const tech = localTechnicians.find(x => x.id === Number(technicianId));
    if (t && tech) {
      t.technician = tech;
      if (t.status === 'OPEN') t.status = 'ASSIGNED';
    }
    return t;
  },

  // Get comments
  async getComments(ticketId) {
    try {
      const res = await fetch(`${BACKEND_BASE}/tickets/${ticketId}/comments`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return localComments[ticketId] || [];
  },

  // Add comment
  async addComment(ticketId, authorName, authorRole, message, isInternal) {
    try {
      const res = await fetch(`${BACKEND_BASE}/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName, authorRole, message, isInternal }),
        signal: AbortSignal.timeout(2000)
      });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    if (!localComments[ticketId]) localComments[ticketId] = [];
    const newComment = {
      id: Date.now(),
      authorName,
      authorRole,
      message,
      isInternal,
      createdAt: new Date().toISOString()
    };
    localComments[ticketId].push(newComment);
    return newComment;
  },

  // Dashboard Stats
  async getDashboardStats() {
    try {
      const res = await fetch(`${BACKEND_BASE}/dashboard/stats`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }

    const total = localTickets.length;
    const open = localTickets.filter(t => t.status === 'OPEN').length;
    const assigned = localTickets.filter(t => t.status === 'ASSIGNED').length;
    const inProgress = localTickets.filter(t => t.status === 'IN_PROGRESS').length;
    const resolved = localTickets.filter(t => t.status === 'RESOLVED').length;
    const closed = localTickets.filter(t => t.status === 'CLOSED').length;
    const critical = localTickets.filter(t => t.priority === 'CRITICAL').length;

    const catCounts = {};
    localCategories.forEach(c => {
      catCounts[c.name] = localTickets.filter(t => t.category?.id === c.id).length;
    });

    return {
      totalTickets: total,
      openTickets: open,
      assignedTickets: assigned,
      inProgressTickets: inProgress,
      resolvedTickets: resolved,
      closedTickets: closed,
      criticalTickets: critical,
      slaBreachRiskTickets: 1,
      resolutionRatePercentage: Math.round(((resolved + closed) / total) * 100),
      ticketsByCategory: catCounts
    };
  },

  // Microservice Audit Log (Port 8085)
  async getMicroserviceAuditLog() {
    try {
      const res = await fetch(`${NOTIFICATION_BASE}/audit-log`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) return await res.json();
    } catch {
      // Fallback
    }
    return localAuditRecords;
  }
};
