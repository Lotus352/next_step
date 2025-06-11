package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.CompanyRequest;
import org.example.next_step.dtos.responses.CompanyResponse;
import org.example.next_step.mappers.CompanyMapper;
import org.example.next_step.models.Company;
import org.example.next_step.repositories.CompanyRepository;
import org.example.next_step.repositories.IndustryRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Business logic for Company entity.
 */
@Service
@RequiredArgsConstructor
public class CompanyService {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;

    private final CompanyRepository companyRepo;
    private final IndustryRepository industryRepo;

    /* ---------- queries ---------- */

    @Transactional(readOnly = true)
    public Page<CompanyResponse> findAll(int page, int size) {
        Pageable pageable = createPageRequest(page, size);
        return companyRepo.findAll(pageable).map(CompanyMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Set<CompanyResponse> findFeatured(int size) {
        Pageable pageable = createPageRequest(DEFAULT_PAGE, size);
        return companyRepo.findByIsFeaturedTrueAndIsDeletedFalse(pageable)
                .stream()
                .map(CompanyMapper::toDTO)
                .collect(Collectors.toSet());
    }

    @Transactional(readOnly = true)
    public CompanyResponse findById(Long id) {
        Company company = companyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        return CompanyMapper.toDTO(company);
    }

    /* ---------- commands ---------- */

    @Transactional
    public CompanyResponse create(CompanyRequest request) {
        Company entity = CompanyMapper.toEntity(request, industryRepo);
        return CompanyMapper.toDTO(companyRepo.save(entity));
    }

    @Transactional
    public CompanyResponse update(Long id, CompanyRequest request) {
        Company existing = companyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        CompanyMapper.updateEntity(existing, request, industryRepo);
        return CompanyMapper.toDTO(companyRepo.save(existing));
    }

    @Transactional
    public void softDelete(Long id) {
        Company company = companyRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setIsDeleted(true);
        companyRepo.save(company);
    }

    /* ---------- helper ---------- */

    private Pageable createPageRequest(int page, int size) {
        return PageRequest.of(Math.max(page, 0),
                Math.max(size, 1),
                Sort.Direction.DESC,
                "createdAt");
    }
}
