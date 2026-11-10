package com.campus.helpdesk.service;

import com.campus.helpdesk.dto.DashboardSummaryDTO;
import com.campus.helpdesk.model.Priority;
import com.campus.helpdesk.model.Status;
import com.campus.helpdesk.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final TicketRepository ticketRepository;

    @Autowired
    public DashboardService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public DashboardSummaryDTO getDashboardMetrics() {
        DashboardSummaryDTO summary = new DashboardSummaryDTO();

        long total = ticketRepository.count();
        long open = ticketRepository.countByStatus(Status.OPEN);
        long assigned = ticketRepository.countByStatus(Status.ASSIGNED);
        long inProgress = ticketRepository.countByStatus(Status.IN_PROGRESS);
        long resolved = ticketRepository.countByStatus(Status.RESOLVED);
        long closed = ticketRepository.countByStatus(Status.CLOSED);
        long critical = ticketRepository.countByPriority(Priority.CRITICAL);

        // Count SLA breaches or tickets due in less than 3 hours
        LocalDateTime now = LocalDateTime.now();
        long slaBreaches = ticketRepository.countOverdueTickets(now);

        summary.setTotalTickets(total);
        summary.setOpenTickets(open);
        summary.setAssignedTickets(assigned);
        summary.setInProgressTickets(inProgress);
        summary.setResolvedTickets(resolved);
        summary.setClosedTickets(closed);
        summary.setCriticalTickets(critical);
        summary.setSlaBreachRiskTickets(slaBreaches);

        // Calculate resolution percentage
        long completed = resolved + closed;
        double rate = total > 0 ? ((double) completed / total) * 100.0 : 0.0;
        summary.setResolutionRatePercentage(Math.round(rate * 10.0) / 10.0);

        // Category breakdown
        Map<String, Long> categoryMap = new HashMap<>();
        List<Object[]> categoryCounts = ticketRepository.countTicketsByCategory();
        for (Object[] row : categoryCounts) {
            categoryMap.put((String) row[0], (Long) row[1]);
        }
        summary.setTicketsByCategory(categoryMap);

        // Priority breakdown
        Map<String, Long> priorityMap = new HashMap<>();
        List<Object[]> priorityCounts = ticketRepository.countTicketsByPriorityGroup();
        for (Object[] row : priorityCounts) {
            priorityMap.put(row[0].toString(), (Long) row[1]);
        }
        summary.setTicketsByPriority(priorityMap);

        return summary;
    }
}
