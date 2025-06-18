package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.SkillRequest;
import org.example.next_step.dtos.responses.SkillResponse;
import org.example.next_step.mappers.SkillMapper;
import org.example.next_step.models.Skill;
import org.example.next_step.repositories.SkillRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository repo;

    @Transactional(readOnly = true)
    public Page<SkillResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("skillName"));
        return repo.findAll(pageable).map(SkillMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public SkillResponse findById(Long id) {
        Skill skill = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        return SkillMapper.toDTO(skill);
    }

    /* ---------- commands ---------- */

    @Transactional
    public SkillResponse create(SkillRequest request) {
        Skill skill = SkillMapper.toEntity(request);
        return SkillMapper.toDTO(repo.save(skill));
    }

    @Transactional
    public SkillResponse update(Long id, SkillRequest request) {
        Skill existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Skill not found"));
        SkillMapper.updateEntity(existing, request);
        return SkillMapper.toDTO(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
