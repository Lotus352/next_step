package org.example.next_step.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.CompanyRequest;
import org.example.next_step.dtos.responses.CompanyResponse;
import org.example.next_step.services.CompanyService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoints for Company entity.
 */
@RestController
@RequestMapping(path = "/api/companies", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class CompanyController {

    private final CompanyService companyService;

    /* ---------- queries ---------- */

    @GetMapping
    public ResponseEntity<Page<CompanyResponse>> findAll(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(companyService.findAll(page, size));
    }

    @GetMapping("/featured")
    public ResponseEntity<?> findFeatured(@RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(companyService.findFeatured(size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(companyService.findById(id));
    }

    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<CompanyResponse> create(@RequestBody @Valid CompanyRequest request) {
        CompanyResponse body = companyService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> update(@PathVariable Long id,
                                                  @RequestBody @Valid CompanyRequest request) {
        return ResponseEntity.ok(companyService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        companyService.softDelete(id);
        return ResponseEntity.noContent().build();
    }
}
