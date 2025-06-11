package org.example.next_step.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.ExperienceLevelRequest;
import org.example.next_step.dtos.responses.ExperienceLevelResponse;
import org.example.next_step.services.ExperienceLevelService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * REST endpoints for ExperienceLevel entity.
 */
@RestController
@RequestMapping(path = "/api/experience-levels", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class ExperienceLevelController {

    private final ExperienceLevelService service;

    /* ---------- queries ---------- */

    @GetMapping
    public ResponseEntity<Page<ExperienceLevelResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(service.findAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExperienceLevelResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<ExperienceLevelResponse> create(
            @RequestBody @Valid ExperienceLevelRequest request) {

        ExperienceLevelResponse body = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExperienceLevelResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid ExperienceLevelRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
