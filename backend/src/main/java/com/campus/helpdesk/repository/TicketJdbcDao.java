package com.campus.helpdesk.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * TicketJdbcDao demonstrates classic Raw JDBC Data Access Layer (Unit III / CO-3).
 * Uses explicit Connection, PreparedStatement parameter binding, ResultSet traversal,
 * and relational SQL JOINs across tickets, categories, and technicians.
 */
@Repository
public class TicketJdbcDao {

    private final DataSource dataSource;

    @Autowired
    public TicketJdbcDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    /**
     * Executes a complex relational SQL JOIN query using raw JDBC Connection and PreparedStatement.
     * Maps across tickets, categories, and technicians.
     */
    public List<Map<String, Object>> findTicketsWithJoinedDetailsRawJdbc(String statusFilter) {
        List<Map<String, Object>> records = new ArrayList<>();

        String sql = "SELECT t.ticket_id, t.ticket_number, t.title, t.priority, t.status, " +
                     "       t.location, t.requester_name, t.sla_due_time, " +
                     "       c.name AS category_name, c.sla_hours, " +
                     "       tech.name AS technician_name, tech.phone AS technician_phone " +
                     "FROM tickets t " +
                     "INNER JOIN categories c ON t.category_id = c.category_id " +
                     "LEFT JOIN technicians tech ON t.technician_id = tech.technician_id " +
                     "WHERE (? IS NULL OR t.status = ?) " +
                     "ORDER BY t.created_at DESC";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, statusFilter);
            stmt.setString(2, statusFilter);

            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("ticketId", rs.getLong("ticket_id"));
                    row.put("ticketNumber", rs.getString("ticket_number"));
                    row.put("title", rs.getString("title"));
                    row.put("priority", rs.getString("priority"));
                    row.put("status", rs.getString("status"));
                    row.put("location", rs.getString("location"));
                    row.put("requesterName", rs.getString("requester_name"));
                    row.put("slaDueTime", rs.getTimestamp("sla_due_time"));
                    row.put("categoryName", rs.getString("category_name"));
                    row.put("slaHours", rs.getInt("sla_hours"));
                    row.put("technicianName", rs.getString("technician_name"));
                    row.put("technicianPhone", rs.getString("technician_phone"));
                    records.add(row);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("JDBC Execution Error while fetching joined ticket records: " + e.getMessage(), e);
        }

        return records;
    }

    /**
     * Executes a subquery and aggregation via Raw JDBC:
     * Counts how many tickets are assigned to each technician compared to the department average.
     */
    public List<Map<String, Object>> getTechnicianWorkloadAnalysisRawJdbc() {
        List<Map<String, Object>> workloadList = new ArrayList<>();

        String sql = "SELECT tech.technician_id, tech.name, tech.department, COUNT(t.ticket_id) AS active_load " +
                     "FROM technicians tech " +
                     "LEFT JOIN tickets t ON tech.technician_id = t.technician_id AND t.status IN ('ASSIGNED', 'IN_PROGRESS') " +
                     "GROUP BY tech.technician_id, tech.name, tech.department " +
                     "ORDER BY active_load DESC";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("technicianId", rs.getLong("technician_id"));
                row.put("technicianName", rs.getString("name"));
                row.put("department", rs.getString("department"));
                row.put("activeLoad", rs.getInt("active_load"));
                workloadList.add(row);
            }
        } catch (SQLException e) {
            throw new RuntimeException("JDBC Execution Error during workload aggregation: " + e.getMessage(), e);
        }

        return workloadList;
    }
}
