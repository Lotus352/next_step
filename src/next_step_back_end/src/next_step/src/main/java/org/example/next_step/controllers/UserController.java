package org.example.next_step.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.example.next_step.dtos.requests.ChangePasswordRequest;
import org.example.next_step.dtos.requests.UserFilterRequest;
import org.example.next_step.dtos.requests.UserRequest;
import org.example.next_step.dtos.responses.JobResponse;
import org.example.next_step.dtos.responses.UserResponse;
import org.example.next_step.security.JwtTokenProvider;
import org.example.next_step.services.UserService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.Set;

@RestController
@RequestMapping(path = "/api/user", produces = "application/json")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/filter")
    public ResponseEntity<Page<UserResponse>> filterUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestBody UserFilterRequest filter
    ) {
        Sort.Direction direction = Sort.Direction.fromString(
                StringUtils.hasText(filter.getSortDirection()) ? filter.getSortDirection() : "DESC"
        );
        String sortBy = StringUtils.hasText(filter.getSortBy()) ? filter.getSortBy() : "createdAt";

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<UserResponse> users = userService.filter(filter, pageable);
        return ResponseEntity.ok(users);
    }


    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        UserResponse userResponse = userService.getUserByUsername(username);
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserRequest user) {
        userService.update(id, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        UserResponse userResponse = userService.getUserByEmail(email);
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/{id}/skills")
    public ResponseEntity<UserResponse> updateUserSkills(@PathVariable Long id, @RequestBody Set<Long> skillIds) {
        return ResponseEntity.ok(userService.updateUserSkills(id, skillIds));
    }

    @PostMapping("/{id}/avatar")
    public ResponseEntity<String> uploadAvatar(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String avatarUrl = userService.uploadAvatar(id, file);
        return ResponseEntity.ok(avatarUrl);
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<String> uploadResume(@PathVariable Long id,
                                               @RequestParam("file") MultipartFile file) {
        String resumeUrl = userService.uploadResume(id, file);
        return ResponseEntity.ok(resumeUrl);
    }

    @GetMapping("/exists/username/{username}")
    public ResponseEntity<Boolean> existsByUsername(@PathVariable String username) {
        boolean exists = userService.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/exists/email/{email}")
    public ResponseEntity<Boolean> existsByEmail(@PathVariable String email) {
        boolean exists = userService.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<String> changePassword(
            @PathVariable Long id,
            @RequestBody @Valid ChangePasswordRequest request) {
        userService.changePassword(id, request);
        return ResponseEntity.ok("Password changed successfully");
    }

    @GetMapping("/{id}/favorite-jobs")
    public ResponseEntity<Page<JobResponse>> getFavoriteJobs(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<JobResponse> favoriteJobs = userService.getFavoriteJobs(id, page, size);
        return ResponseEntity.ok(favoriteJobs);
    }

    @PutMapping("/is-send")
    public ResponseEntity<Void> toggleIsSend(HttpServletRequest request) {
        String username = getUsernameRequest(request);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        userService.toggleIsSend(username);
        return ResponseEntity.ok().build();
    }


    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<UserResponse> create(@RequestBody @Valid UserRequest request) {
        UserResponse body = userService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @RequestBody @Valid UserRequest request) {
        return ResponseEntity.ok(userService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

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