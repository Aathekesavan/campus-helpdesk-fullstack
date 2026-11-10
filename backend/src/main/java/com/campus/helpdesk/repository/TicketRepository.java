package com.campus.helpdesk.repository;

import com.campus.helpdesk.model.Priority;
import com.campus.helpdesk.model.Status;
import com.campus.helpdesk.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    Optional<Ticket> findByTicketNumber(String ticketNumber);

    List<Ticket> findByStatus(Status status);

    List<Ticket> findByPriority(Priority priority);

    List<Ticket> findByRequesterEmailOrderByCreatedAtDesc(String requesterEmail);

    List<Ticket> findByTechnicianId(Long technicianId);

    // Dynamic Multi-Criteria Search & Filter Query (Unit III & V Querying)
    @Query("SELECT t FROM Ticket t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:categoryId IS NULL OR t.category.id = :categoryId) AND " +
           "(:search IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(t.ticketNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(t.location) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(t.requesterName) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY t.createdAt DESC")
    List<Ticket> searchTickets(
            @Param("status") Status status,
            @Param("priority") Priority priority,
            @Param("categoryId") Long categoryId,
            @Param("search") String search);

    // Count statistics
    long countByStatus(Status status);

    long countByPriority(Priority priority);

    // Overdue SLA detection query
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status NOT IN ('RESOLVED', 'CLOSED') AND t.slaDueTime < :now")
    long countOverdueTickets(@Param("now") LocalDateTime now);

    // Imminent SLA breach (within next 2 hours)
    @Query("SELECT t FROM Ticket t WHERE t.status NOT IN ('RESOLVED', 'CLOSED') AND t.slaDueTime BETWEEN :now AND :window ORDER BY t.slaDueTime ASC")
    List<Ticket> findImminentSlaBreaches(@Param("now") LocalDateTime now, @Param("window") LocalDateTime window);

    // Grouping queries for dashboard aggregations
    @Query("SELECT t.category.name, COUNT(t) FROM Ticket t GROUP BY t.category.name")
    List<Object[]> countTicketsByCategory();

    @Query("SELECT t.priority, COUNT(t) FROM Ticket t GROUP BY t.priority")
    List<Object[]> countTicketsByPriorityGroup();
}
