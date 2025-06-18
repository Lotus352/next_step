package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.NotificationRequest;
import org.example.next_step.dtos.responses.NotificationResponse;
import org.example.next_step.mappers.NotificationMapper;
import org.example.next_step.models.Notification;
import org.example.next_step.repositories.JobRepository;
import org.example.next_step.repositories.NotificationRepository;
import org.example.next_step.repositories.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repo;
    private final UserRepository userRepo;
    private final JobRepository jobRepo;

    @Transactional(readOnly = true)
    public Page<NotificationResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return repo.findAll(pageable).map(NotificationMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> findAll(int page, int size, String username) {
        Sort sort = Sort.by(Sort.Direction.ASC, "status")
                .and(Sort.by(Sort.Direction.DESC, "readAt"))
                .and(Sort.by(Sort.Direction.DESC, "createdAt"));

        Pageable pageable = PageRequest.of(page, size, sort);

        if (username != null && !username.isBlank()) {
            return repo.findByUser_Username(username, pageable)
                    .map(NotificationMapper::toDTO);
        }

        return repo.findAll(pageable).map(NotificationMapper::toDTO);
    }


    @Transactional(readOnly = true)
    public NotificationResponse findById(Long id) {
        Notification note = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        return NotificationMapper.toDTO(note);
    }

    @Transactional
    public void markAsRead(Long id) {
        Notification notification = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setStatus("READ");
        notification.setReadAt(LocalDateTime.now());
        repo.save(notification);
    }

    @Transactional
    public void markAllAsRead(String username) {
        repo.markAllAsReadByUsername(username);
    }

    @Transactional(readOnly = true)
    public long countUnreadByUsername(String username) {
        return repo.countByUsernameAndStatus(username, "UNREAD");
    }

    /* ---------- commands ---------- */

    @Transactional
    public NotificationResponse create(NotificationRequest request) {
        Notification entity = NotificationMapper.toEntity(request, userRepo, jobRepo);
        return NotificationMapper.toDTO(repo.save(entity));
    }

    @Transactional
    public NotificationResponse update(Long id, NotificationRequest request) {
        Notification existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        NotificationMapper.updateEntity(existing, request, userRepo, jobRepo);
        return NotificationMapper.toDTO(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
