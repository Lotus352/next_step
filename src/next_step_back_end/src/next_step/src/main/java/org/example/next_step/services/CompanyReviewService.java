package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.CompanyReviewRequest;
import org.example.next_step.dtos.responses.CompanyReviewResponse;
import org.example.next_step.mappers.CompanyReviewMapper;
import org.example.next_step.models.CompanyReview;
import org.example.next_step.repositories.CompanyRepository;
import org.example.next_step.repositories.CompanyReviewRepository;
import org.example.next_step.repositories.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Business logic for CompanyReview entity.
 */
@Service
@RequiredArgsConstructor
public class CompanyReviewService {

    private final CompanyReviewRepository reviewRepo;
    private final CompanyRepository companyRepo;
    private final UserRepository userRepo;

    /* ---------- queries ---------- */

    @Transactional(readOnly = true)
    public Page<CompanyReviewResponse> getAllReviews(int page, int size) {
        Pageable pageable = createPageRequest(page, size);
        return reviewRepo.findAll(pageable).map(CompanyReviewMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<CompanyReviewResponse> findAll(int page, int size) {
        return getAllReviews(page, size);
    }

    @Transactional(readOnly = true)
    public Page<CompanyReviewResponse> getReviewsByCompanyId(int page, int size, Long companyId) {
        Pageable pageable = createPageRequest(page, size);
        return reviewRepo.findByCompany_CompanyId(companyId, pageable).map(CompanyReviewMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public Page<CompanyReviewResponse> findByCompany(Long companyId, int page, int size) {
        return getReviewsByCompanyId(page, size, companyId);
    }

    @Transactional(readOnly = true)
    public boolean hasUserCommented(Long companyId, Long userId) {
        return reviewRepo.existsByCompanyIdAndUserId(companyId, userId);
    }

    /* ---------- commands ---------- */

    @Transactional
    public CompanyReviewResponse createReview(CompanyReviewRequest request) {
        CompanyReview entity = CompanyReviewMapper.toEntity(request, companyRepo, userRepo);
        return CompanyReviewMapper.toDTO(reviewRepo.save(entity));
    }

    @Transactional
    public CompanyReviewResponse updateReview(Long id, CompanyReviewRequest request) {
        CompanyReview existing = reviewRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        CompanyReviewMapper.updateEntity(existing, request, companyRepo, userRepo);
        return CompanyReviewMapper.toDTO(reviewRepo.save(existing));
    }

    @Transactional
    public void deleteReview(Long id) {
        reviewRepo.deleteById(id);
    }

    /* ---------- helper ---------- */

    private Pageable createPageRequest(int page, int size) {
        return PageRequest.of(Math.max(page, 0),
                Math.max(size, 1),
                Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
