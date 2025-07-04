package org.example.next_step.dtos.requests;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationRequest {
    private Long userId;
    private Long jobId;
    private String message;
    private String status;
    private LocalDateTime readAt;
}
