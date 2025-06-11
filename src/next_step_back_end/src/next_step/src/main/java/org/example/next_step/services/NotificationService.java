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

/**
 * Business logic for Notification entity.
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repo;
    private final UserRepository userRepo;
    private final JobRepository jobRepo;

    /* ---------- queries ---------- */

    @Transactional(readOnly = true)
    public Page<NotificationResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return repo.findAll(pageable).map(NotificationMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public NotificationResponse findById(Long id) {
        Notification note = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        return NotificationMapper.toDTO(note);
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
