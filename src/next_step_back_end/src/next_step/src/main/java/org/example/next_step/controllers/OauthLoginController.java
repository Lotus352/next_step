package org.example.next_step.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.OauthLoginRequest;
import org.example.next_step.dtos.responses.OauthLoginResponse;
import org.example.next_step.services.OauthLoginService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/oauth-logins", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class OauthLoginController {

    private final OauthLoginService service;

    @GetMapping
    public ResponseEntity<Page<OauthLoginResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(service.findAll(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OauthLoginResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<OauthLoginResponse> create(
            @RequestBody @Valid OauthLoginRequest request) {

        OauthLoginResponse body = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OauthLoginResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid OauthLoginRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
