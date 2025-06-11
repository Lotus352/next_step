package org.example.next_step.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.LocationRequest;
import org.example.next_step.dtos.responses.LocationResponse;
import org.example.next_step.services.LocationService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST endpoints for Location entity.
 */
@RestController
@RequestMapping(path = "/api/locations", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class LocationController {

    private final LocationService service;

    /* ---------- queries ---------- */

    @GetMapping
    public ResponseEntity<Page<LocationResponse>> findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(service.findAll(page, size));
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> findCitiesByCountry(
            @RequestParam(required = true) String country) {
        return ResponseEntity.ok(service.findCitiesByCountry(country.trim()));
    }
    
    @GetMapping("/countries")
    public ResponseEntity<List<String>> findAllCountries() {
        return ResponseEntity.ok(service.findAllCountries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocationResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    /* ---------- commands ---------- */

    @PostMapping
    public ResponseEntity<LocationResponse> create(
            @RequestBody @Valid LocationRequest request) {

        LocationResponse body = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocationResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid LocationRequest request) {

        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
