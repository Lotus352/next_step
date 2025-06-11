package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.LocationRequest;
import org.example.next_step.dtos.responses.LocationResponse;
import org.example.next_step.mappers.LocationMapper;
import org.example.next_step.models.Location;
import org.example.next_step.repositories.LocationRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Set;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class LocationService {
    private final LocationRepository repo;
    private static final String COUNTRIES_JSON_PATH = "src/main/java/org/example/next_step/data/countries.min.json";
    private static Map<String, List<String>> countryCityMap;

    private void loadCountryCityData() {
        if (countryCityMap == null) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                String json = new String(Files.readAllBytes(Paths.get(COUNTRIES_JSON_PATH)));
                countryCityMap = mapper.readValue(json, new TypeReference<Map<String, List<String>>>() {});
            } catch (IOException e) {
                countryCityMap = new HashMap<>();
                throw new RuntimeException("Không thể đọc dữ liệu quốc gia/city từ file JSON", e);
            }
        }
    }

    /* ────────────── queries ────────────── */

    @Transactional(readOnly = true)
    public Page<LocationResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("countryName", "city"));
        return repo.findAll(pageable).map(LocationMapper::toDTO);
    }

    /**
     * Returns distinct city names; pass "all" to get cities of every country.
     */
    @Transactional(readOnly = true)
    public List<String> findCitiesByCountry(String country) {
        loadCountryCityData();
        if (country.equalsIgnoreCase("all")) {
            List<String> allCities = new ArrayList<>();
            for (List<String> cities : countryCityMap.values()) {
                allCities.addAll(cities);
            }
            return allCities;
        }
        return countryCityMap.getOrDefault(country, new ArrayList<>());
    }

    public List<String> findStatesByCountry(String country) {

        String url = UriComponentsBuilder.newInstance().scheme("https").host("countriesnow.space").path("/api/v0.1/countries/states/q").queryParam("country", country).toUriString();

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<JsonNode> response = restTemplate.getForEntity(url, JsonNode.class);

        List<String> states = new ArrayList<>();
        if (response.getStatusCode().is2xxSuccessful()) {
            JsonNode body = response.getBody();
            if (body != null && !body.path("error").asBoolean()) {
                JsonNode statesNode = body.path("data").path("states");
                statesNode.forEach(state -> states.add(state.path("name").asText()));
            }
        }
        return states;
    }

    public List<String> findAllCountries() {
        loadCountryCityData();
        return new ArrayList<>(countryCityMap.keySet());
    }

    @Transactional(readOnly = true)
    public LocationResponse findById(Long id) {
        Location loc = repo.findById(id).orElseThrow(() -> new RuntimeException("Location not found"));
        return LocationMapper.toDTO(loc);
    }

    /* ────────────── commands ────────────── */

    @Transactional
    public LocationResponse create(LocationRequest request) {
        Location entity = LocationMapper.toEntity(request);
        return LocationMapper.toDTO(repo.save(entity));
    }

    @Transactional
    public LocationResponse update(Long id, LocationRequest request) {
        Location existing = repo.findById(id).orElseThrow(() -> new RuntimeException("Location not found"));
        LocationMapper.updateEntity(existing, request);
        return LocationMapper.toDTO(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Location not found");
        }
        repo.deleteById(id);
    }

}