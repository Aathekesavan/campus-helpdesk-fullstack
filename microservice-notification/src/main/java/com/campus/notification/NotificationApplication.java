package com.campus.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NotificationApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  Notification & SLA Alert Microservice is RUNNING! (CO-5)       ");
        System.out.println("  Port:            http://localhost:8085                         ");
        System.out.println("  Dispatch API:    POST http://localhost:8085/api/notifications/dispatch");
        System.out.println("  Audit Log API:   GET  http://localhost:8085/api/notifications/audit-log");
        System.out.println("  Health API:      GET  http://localhost:8085/api/notifications/health   ");
        System.out.println("==================================================================");
    }
}
