package org.example.next_step.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.PermissionRequest;
import org.example.next_step.dtos.responses.PermissionResponse;
import org.example.next_step.services.PermissionService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/permissions", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class PermissionController {

    private final PermissionService service;

    @GetMapping
    public ResponseEntity<Page<PermissionResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(service.findAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PermissionResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<PermissionResponse> create(
            @RequestBody @Valid PermissionRequest request) {

        PermissionResponse body = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PermissionResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid PermissionRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
