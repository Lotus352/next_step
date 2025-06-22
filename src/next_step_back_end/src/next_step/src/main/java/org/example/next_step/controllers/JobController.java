package org.example.next_step.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.JobFilterRequest;
import org.example.next_step.dtos.requests.JobRequest;
import org.example.next_step.dtos.responses.JobFeaturedResponse;
import org.example.next_step.dtos.responses.JobResponse;
import org.example.next_step.dtos.responses.UserResponse;
import org.example.next_step.services.JobService;
import org.example.next_step.services.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.example.next_step.security.JwtTokenProvider;

import java.util.Set;

@RestController
@RequestMapping(path = "/api/jobs", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class JobController {
    private final JobService service;
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    /* ─────────────────────── QUERIES ─────────────────────── */

    @GetMapping("/employment-types")
    public ResponseEntity<Set<String>> getEmploymentTypes() {
        return ResponseEntity.ok(service.getEmploymentTypes());
    }

    @GetMapping("/featured")
    public ResponseEntity<Set<JobFeaturedResponse>> getFeaturedJobs(@RequestParam(defaultValue = "6") int size,
                                                                    @RequestParam(defaultValue = "") String filter,
                                                                    HttpServletRequest request) {
        String username = getUsernameRequest(request);
        return ResponseEntity.ok(service.getFeaturedJobs(size, filter, username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> findById(@PathVariable Long id,
                                                HttpServletRequest request) {
        String username = getUsernameRequest(request);
        return ResponseEntity.ok(service.findById(id, username));
    }

    @PostMapping("/filter")
    public ResponseEntity<Page<JobResponse>> filter(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size,
                                                    @RequestBody JobFilterRequest filter,
                                                    HttpServletRequest request) {
        String username = getUsernameRequest(request);
        return ResponseEntity.ok(service.filter(page, size, filter, username));
    }

    @PutMapping("/{id}/favorite")
    public ResponseEntity<Void> toggleFavoriteJob(@PathVariable Long id, HttpServletRequest request) {
        String username = getUsernameRequest(request);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        service.toggleFavoriteJob(id, username);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Void> changeJobStatus(@PathVariable Long id,
                                                @RequestParam String status,
                                                HttpServletRequest request) {
        String username = getUsernameRequest(request);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        service.changeStatus(id, status);
        return ResponseEntity.ok().build();
    }

    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<JobResponse> create(@RequestBody JobRequest request,
                                              HttpServletRequest httpServletRequest) {
        String username = getUsernameRequest(httpServletRequest);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserResponse user = userService.getUserByUsername(username);
        request.setUserId(user.getUserId());

        JobResponse body = service.create(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> update(@PathVariable Long id, @RequestBody @Valid JobRequest request) {
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
