package org.example.next_step.controllers;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.JobApplicationFilterRequest;
import org.example.next_step.dtos.responses.JobApplicationInformationResponse;
import org.example.next_step.dtos.responses.JobApplicationResponse;
import org.example.next_step.mappers.JobApplicationMapper;
import org.example.next_step.models.JobApplication;
import org.example.next_step.security.JwtTokenProvider;
import org.example.next_step.services.JobApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping(path = "/api/job-applications", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class JobApplicationController {

    private final JobApplicationService service;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/jobs/{jobId}/information")
    public ResponseEntity<JobApplicationInformationResponse> getApplicationsInformation(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(service.getInfoByJob(jobId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping("/jobs/{jobId}/filter")
    public ResponseEntity<Page<JobApplicationResponse>> filterApplicationByJob(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestBody @Valid JobApplicationFilterRequest filter) {
        return ResponseEntity.ok(service.filterApplicationByJob(jobId, page, size, filter));
    }

    @GetMapping("/has-applied")
    public ResponseEntity<?> hasApplied(@RequestParam("jobId") Long jobId, HttpServletRequest request) {
        String username = getUsernameRequest(request);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<JobApplication> appOpt = service.getApplicationIfApplied(username, jobId);
        if (appOpt.isPresent()) {
            return ResponseEntity.ok(JobApplicationMapper.toDTO(appOpt.get()));
        } else {
            return ResponseEntity.ok(null);
        }
    }


    @PostMapping("/apply")
    public ResponseEntity<String> apply(@RequestParam("file") MultipartFile file,
                                        @RequestParam("userId") Long userId,
                                        @RequestParam("jobId") Long jobId,
                                        @RequestParam("coverLetter") String coverLetter,
                                        HttpServletRequest request) {
        String resumeUrl = service.apply(file, userId, jobId, coverLetter, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(resumeUrl);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> status(@PathVariable Long id,
                                         @RequestParam("status") String status) {
        service.status(id, status);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/{id}/can-withdraw")
    public ResponseEntity<Boolean> canWithdraw(@PathVariable("id") Long applicationId) {
        boolean result = service.canWithdrawApplication(applicationId);
        return ResponseEntity.ok(result);
    }

    /* ---------- commands ---------- */

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
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
