package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.ExperienceLevelRequest;
import org.example.next_step.dtos.responses.ExperienceLevelResponse;
import org.example.next_step.mappers.ExperienceLevelMapper;
import org.example.next_step.models.ExperienceLevel;
import org.example.next_step.repositories.ExperienceLevelRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Business logic for ExperienceLevel entity.
 */
@Service
@RequiredArgsConstructor
public class ExperienceLevelService {

    private final ExperienceLevelRepository repo;

    /* ---------- queries ---------- */

    @Transactional(readOnly = true)
    public Page<ExperienceLevelResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("experienceName"));
        return repo.findAll(pageable).map(ExperienceLevelMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public ExperienceLevelResponse findById(Long id) {
        ExperienceLevel level = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience level not found"));
        return ExperienceLevelMapper.toDTO(level);
    }

    /* ---------- commands ---------- */

    @Transactional
    public ExperienceLevelResponse create(ExperienceLevelRequest request) {
        ExperienceLevel entity = ExperienceLevelMapper.toEntity(request);
        return ExperienceLevelMapper.toDTO(repo.save(entity));
    }

    @Transactional
    public ExperienceLevelResponse update(Long id, ExperienceLevelRequest request) {
        ExperienceLevel existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience level not found"));
        ExperienceLevelMapper.updateEntity(existing, request);
        return ExperienceLevelMapper.toDTO(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
