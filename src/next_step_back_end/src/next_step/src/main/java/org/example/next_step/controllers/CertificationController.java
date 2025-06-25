package org.example.next_step.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.CertificationRequest;
import org.example.next_step.dtos.responses.CertificationResponse;
import org.example.next_step.services.CertificationService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/certifications", produces = "application/json")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService service;

    @GetMapping
    public ResponseEntity<Page<CertificationResponse>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String key) {
        return ResponseEntity.ok(service.getAll(page, size, key.trim().toLowerCase()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CertificationResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<CertificationResponse> create(
            @RequestBody @Valid CertificationRequest request) {
        CertificationResponse body = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CertificationResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid CertificationRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}