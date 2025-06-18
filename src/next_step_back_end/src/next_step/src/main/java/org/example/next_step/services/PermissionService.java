package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.PermissionRequest;
import org.example.next_step.dtos.responses.PermissionResponse;
import org.example.next_step.mappers.PermissionMapper;
import org.example.next_step.models.Permission;
import org.example.next_step.repositories.PermissionRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository repo;

    @Transactional(readOnly = true)
    public Page<PermissionResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("permissionName"));
        return repo.findAll(pageable).map(PermissionMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public PermissionResponse findById(Long id) {
        Permission p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
        return PermissionMapper.toDTO(p);
    }

    /* ---------- commands ---------- */

    @Transactional
    public PermissionResponse create(PermissionRequest request) {
        Permission entity = PermissionMapper.toEntity(request);
        return PermissionMapper.toDTO(repo.save(entity));
    }

    @Transactional
    public PermissionResponse update(Long id, PermissionRequest request) {
        Permission existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
        PermissionMapper.updateEntity(existing, request);
        return PermissionMapper.toDTO(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
