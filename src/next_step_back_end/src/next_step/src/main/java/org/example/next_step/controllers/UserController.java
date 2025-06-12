package org.example.next_step.controllers;

import org.example.next_step.dtos.requests.RegisterRequest;
import org.example.next_step.dtos.requests.UserRequest;
import org.example.next_step.dtos.responses.UserResponse;
import org.example.next_step.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;

import java.util.Set;

@RestController
@RequestMapping(path = "/api/user", produces = "application/json")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        UserResponse userResponse = userService.getUserByUsername(username);
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserRequest user) {
        userService.updateUser(id, user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        UserResponse userResponse = userService.getUserByEmail(email);
        return ResponseEntity.ok(userResponse);
    }

    @PutMapping("/{id}/skills")
    public ResponseEntity<Void> updateUserSkills(@PathVariable Long id, @RequestBody Set<Long> skillIds) {
        userService.updateUserSkills(id, skillIds);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/avatar")
    public ResponseEntity<String> uploadAvatar(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String avatarUrl = userService.uploadAvatar(id, file);
        return ResponseEntity.ok(avatarUrl);
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<String> uploadResume(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        String resumeUrl = userService.uploadResume(id, file);
        return ResponseEntity.ok(resumeUrl);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
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
} 