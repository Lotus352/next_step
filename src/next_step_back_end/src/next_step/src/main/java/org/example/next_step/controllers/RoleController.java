package org.example.next_step.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/roles", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class RoleController {

    @GetMapping("/candidate")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<String> candidateAccess() {
        return ResponseEntity.ok("Hello, CANDIDATE! You have access to this endpoint.");
    }

    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<String> employerAccess() {
        return ResponseEntity.ok("Hello, EMPLOYER! You have access to this endpoint.");
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminAccess() {
        return ResponseEntity.ok("Hello, ADMIN! You have access to this endpoint.");
    }
}
