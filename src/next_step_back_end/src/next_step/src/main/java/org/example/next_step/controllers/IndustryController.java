package org.example.next_step.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.IndustryRequest;
import org.example.next_step.dtos.responses.IndustryResponse;
import org.example.next_step.services.IndustryService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoints for Industry entity.
 */
@RestController
@RequestMapping(path = "/api/industries", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class IndustryController {

    private final IndustryService service;

    /* ---------- queries ---------- */

    @GetMapping
    public ResponseEntity<Page<IndustryResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(service.findAll(page, size));
    }

    @GetMapping("/featured")
    public ResponseEntity<?> findFeatured(@RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(service.findFeatured(size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IndustryResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<IndustryResponse> create(
            @RequestBody @Valid IndustryRequest request) {

        IndustryResponse body = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IndustryResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid IndustryRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
