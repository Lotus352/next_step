package org.example.next_step.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.CompanyReviewRequest;
import org.example.next_step.dtos.responses.CompanyReviewResponse;
import org.example.next_step.services.CompanyReviewService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/company-reviews", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class CompanyReviewController {

    private final CompanyReviewService service;

    @GetMapping
    public ResponseEntity<Page<CompanyReviewResponse>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(service.getAllReviews(page, size));
    }

    @GetMapping("/companies/{companyId}")
    public ResponseEntity<Page<CompanyReviewResponse>> getReviewsByCompanyId(
            @PathVariable Long companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(service.getReviewsByCompanyId(page, size, companyId));
    }

    @GetMapping("/has-commented")
    public ResponseEntity<Boolean> hasUserCommented(
            @RequestParam Long companyId,
            @RequestParam Long userId) {
        boolean hasCommented = service.hasUserCommented(companyId, userId);
        return ResponseEntity.ok(hasCommented);
    }

    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<CompanyReviewResponse> create(
            @RequestBody @Valid CompanyReviewRequest request) {
        CompanyReviewResponse body = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyReviewResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid CompanyReviewRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
