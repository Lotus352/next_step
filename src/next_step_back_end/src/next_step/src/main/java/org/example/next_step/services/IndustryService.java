package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.IndustryRequest;
import org.example.next_step.dtos.responses.IndustryResponse;
import org.example.next_step.mappers.IndustryMapper;
import org.example.next_step.models.Industry;
import org.example.next_step.repositories.IndustryRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IndustryService {

    private final IndustryRepository repo;

    @Transactional(readOnly = true)
    public Page<IndustryResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("industryName"));
        return repo.findAll(pageable).map(IndustryMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<IndustryResponse> findFeatured(int size) {
        Pageable pageable = PageRequest.of(0, size);
        return repo.findTopIndustriesByJobCount(pageable)
                .stream()
                .map(IndustryMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public IndustryResponse findById(Long id) {
        Industry industry = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Industry not found"));
        return IndustryMapper.toDTO(industry);
    }

    /* ---------- commands ---------- */

    @Transactional
    public IndustryResponse create(IndustryRequest request) {
        Industry entity = IndustryMapper.toEntity(request);
        return IndustryMapper.toDTO(repo.save(entity));
    }

    @Transactional
    public IndustryResponse update(Long id, IndustryRequest request) {
        Industry existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Industry not found"));
        IndustryMapper.updateEntity(existing, request);
        return IndustryMapper.toDTO(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
