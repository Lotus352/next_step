package org.example.next_step.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.NotificationRequest;
import org.example.next_step.dtos.responses.NotificationResponse;
import org.example.next_step.services.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.example.next_step.security.JwtTokenProvider;


@RestController
@RequestMapping(path = "/api/notifications", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class NotificationController {

    private final NotificationService service;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping
    public ResponseEntity<Page<NotificationResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        String username = getUsernameRequest(request);
        if (username == null) {
            return ResponseEntity.ok(service.findAll(page, size));
        }
        return ResponseEntity.ok(service.findAll(page, size, username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(HttpServletRequest request) {
        String username = getUsernameRequest(request);
        if (username != null) {
            service.markAllAsRead(username);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> countUnread(HttpServletRequest request) {
        String username = getUsernameRequest(request);
        if (username == null) {
            return ResponseEntity.ok(0L);
        }
        long count = service.countUnreadByUsername(username);
        return ResponseEntity.ok(count);
    }


    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<NotificationResponse> create(
            @RequestBody @Valid NotificationRequest request) {

        NotificationResponse body = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificationResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid NotificationRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    /* ---------- private helpers ---------- */

    private String getUsernameRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        String token = jwtTokenProvider.extractToken(authorizationHeader);
        String username = null;
        if (token != null && jwtTokenProvider.validateToken(token)) {
            username = jwtTokenProvider.extractUsername(token);
        }
        return username;
    }
}
