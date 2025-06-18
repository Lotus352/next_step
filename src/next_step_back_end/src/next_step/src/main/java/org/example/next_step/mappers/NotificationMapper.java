package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.NotificationRequest;
import org.example.next_step.dtos.responses.NotificationResponse;
import org.example.next_step.models.Job;
import org.example.next_step.models.Notification;
import org.example.next_step.models.User;
import org.example.next_step.repositories.JobRepository;
import org.example.next_step.repositories.UserRepository;

import java.time.LocalDateTime;

public class NotificationMapper {

    public static NotificationResponse toDTO(Notification notification) {
        if (notification == null) {
            return null;
        }
        return NotificationResponse.builder()
                .notificationId(notification.getNotificationId())
                .user(notification.getUser() != null ? UserMapper.toDTO(notification.getUser()) : null)
                .job(notification.getJob() != null ? JobMapper.toDTO(notification.getJob(), null) : null)
                .message(notification.getMessage())
                .status(notification.getStatus())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }

    public static Notification toEntity(NotificationRequest request,
                                        UserRepository userRepo,
                                        JobRepository jobRepo) {
        if (request == null) {
            return null;
        }
        Notification notification = new Notification();
        if (request.getUserId() != null) {
            User user = userRepo.findById(request.getUserId()).orElse(null);
            notification.setUser(user);
        }
        if (request.getJobId() != null) {
            Job job = jobRepo.findById(request.getJobId()).orElse(null);
            notification.setJob(job);
        }
        notification.setMessage(request.getMessage());
        notification.setStatus(request.getStatus());
        notification.setCreatedAt(LocalDateTime.now());
        notification.setReadAt(request.getReadAt());
        return notification;
    }

    public static void updateEntity(Notification notification,
                                    NotificationRequest request,
                                    UserRepository userRepo,
                                    JobRepository jobRepo) {
        if (request == null) {
            return;
        }
        if (request.getUserId() != null) {
            User user = userRepo.findById(request.getUserId()).orElse(null);
            notification.setUser(user);
        }
        if (request.getJobId() != null) {
            Job job = jobRepo.findById(request.getJobId()).orElse(null);
            notification.setJob(job);
        }
        if (request.getMessage() != null) {
            notification.setMessage(request.getMessage());
        }
        if (request.getStatus() != null) {
            notification.setStatus(request.getStatus());
        }
        if (request.getReadAt() != null) {
            notification.setReadAt(request.getReadAt());
        }
    }
}
