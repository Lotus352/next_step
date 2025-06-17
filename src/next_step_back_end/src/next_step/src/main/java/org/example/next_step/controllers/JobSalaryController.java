package org.example.next_step.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.JobSalaryRequest;
import org.example.next_step.dtos.responses.JobSalaryRangeResponse;
import org.example.next_step.dtos.responses.JobSalaryResponse;
import org.example.next_step.services.JobSalaryService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/job-salaries", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class JobSalaryController {

    private final JobSalaryService service;

    @GetMapping
    public ResponseEntity<Page<JobSalaryResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(service.findAll(page, size));
    }

    @GetMapping("/currencies")
    public ResponseEntity<List<String>> findAllCurrencies() {
        return ResponseEntity.ok(service.findAllCurrencies());
    }

    @GetMapping("/pay-periods")
    public ResponseEntity<List<String>> findAllPayPeriods() {
        return ResponseEntity.ok(service.findAllPayPeriods());
    }

    @GetMapping("/salary-ranges")
    public ResponseEntity<JobSalaryRangeResponse> findSalaryRange(
            @RequestParam String currency,
            @RequestParam String payPeriod) {
        return ResponseEntity.ok(service.findSalaryRange(currency, payPeriod));
    }

    @GetMapping("/salary-max-min")
    public ResponseEntity<JobSalaryRangeResponse> findMaxMinSalary() {
        return ResponseEntity.ok(service.findMaxMinSalary());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobSalaryResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<JobSalaryResponse> create(
            @RequestBody @Valid JobSalaryRequest request) {

        JobSalaryResponse body = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobSalaryResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid JobSalaryRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
