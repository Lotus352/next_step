package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.CertificationRequest;
import org.example.next_step.dtos.responses.CertificationResponse;
import org.example.next_step.mappers.CertificationMapper;
import org.example.next_step.models.Certification;
import org.example.next_step.repositories.CertificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository repository;

    @Transactional(readOnly = true)
    public Page<CertificationResponse> getAll(int page, int size, String key) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Certification> certs;

        if (key == null || key.isBlank()) {
            certs = repository.findAll(pageable);
        } else {
            certs = repository.searchByKey(key, pageable);
        }

        return certs.map(CertificationMapper::toDTO);
    }


    @Transactional(readOnly = true)
    public CertificationResponse getById(Long id) {
        Certification entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Certification not found"));
        return CertificationMapper.toDTO(entity);
    }

    /* ---------- commands ---------- */

    @Transactional
    public CertificationResponse create(CertificationRequest request) {
        if (repository.existsByCertificationNameIgnoreCase(request.getCertificationName())) {
            throw new IllegalArgumentException("Certification name already exists");
        }

        Certification entity = CertificationMapper.toEntity(request);
        return CertificationMapper.toDTO(repository.save(entity));
    }

    @Transactional
    public CertificationResponse update(Long id, CertificationRequest request) {
        Certification entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Certification not found"));

        CertificationMapper.updateEntity(entity, request);
        return CertificationMapper.toDTO(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        Certification entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Certification not found"));

        repository.deleteById(id);
    }
}