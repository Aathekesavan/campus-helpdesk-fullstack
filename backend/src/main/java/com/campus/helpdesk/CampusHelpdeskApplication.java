package com.campus.helpdesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CampusHelpdeskApplication {

    public static void main(String[] args) {
        SpringApplication.run(CampusHelpdeskApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  SRM IST Campus Helpdesk & Maintenance Request API is RUNNING!   ");
        System.out.println("  Port:            http://localhost:8080                         ");
        System.out.println("  Tickets API:     http://localhost:8080/api/tickets             ");
        System.out.println("  Dashboard API:   http://localhost:8080/api/dashboard/stats     ");
        System.out.println("  H2 SQL Console:  http://localhost:8080/h2-console              ");
        System.out.println("  Raw JDBC API:    http://localhost:8080/api/tickets/raw-jdbc    ");
        System.out.println("==================================================================");
    }
}
