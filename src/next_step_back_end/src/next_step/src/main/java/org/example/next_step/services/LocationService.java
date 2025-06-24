package org.example.next_step.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.LocationRequest;
import org.example.next_step.dtos.responses.LocationResponse;
import org.example.next_step.mappers.LocationMapper;
import org.example.next_step.models.Location;
import org.example.next_step.repositories.LocationRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository repo;
    private static final String COUNTRIES_JSON_CLASSPATH = "data/countries.min.json";
    private static Map<String, List<String>> countryCityMap;

    private static void loadCountryCityData() {
        if (countryCityMap != null) return;
        synchronized (LocationService.class) {
            if (countryCityMap != null) return;
            try {
                byte[] bytes = new ClassPathResource(COUNTRIES_JSON_CLASSPATH).getInputStream().readAllBytes();
                ObjectMapper mapper = new ObjectMapper();
                Map<String, List<String>> raw = mapper.readValue(bytes, new TypeReference<>() {
                });
                Map<String, List<String>> tmp = new ConcurrentHashMap<>();
                raw.forEach((country, cities) -> {
                    List<String> uniqueCities = new ArrayList<>(new LinkedHashSet<>(cities));
                    tmp.put(country, Collections.unmodifiableList(uniqueCities));
                });
                countryCityMap = Collections.unmodifiableMap(tmp);
            } catch (IOException e) {
                throw new IllegalStateException("Unable to read country/city JSON", e);
            }
        }
    }

    @Transactional(readOnly = true)
    public Page<LocationResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("countryName", "city"));
        return repo.findAll(pageable).map(LocationMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<String> findCitiesByCountry(String country) {
        loadCountryCityData();
        if ("all".equalsIgnoreCase(country)) {
            Set<String> unique = new LinkedHashSet<>();
            countryCityMap.values().forEach(unique::addAll);
            return List.copyOf(unique);
        }
        return countryCityMap.getOrDefault(country, List.of());
    }

    public List<String> findAllCountries() {
        loadCountryCityData();
        return List.copyOf(countryCityMap.keySet());
    }

    @Transactional(readOnly = true)
    public LocationResponse findById(Long id) {
        Location loc = repo.findById(id).orElseThrow(() -> new NoSuchElementException("Location not found"));
        return LocationMapper.toDTO(loc);
    }

    @Transactional
    public LocationResponse create(LocationRequest request) {
        Location entity = LocationMapper.toEntity(request);
        return LocationMapper.toDTO(repo.save(entity));
    }

    @Transactional
    public LocationResponse update(Long id, LocationRequest request) {
        Location existing = repo.findById(id).orElseThrow(() -> new NoSuchElementException("Location not found"));
        LocationMapper.updateEntity(existing, request);
        return LocationMapper.toDTO(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new NoSuchElementException("Location not found");
        repo.deleteById(id);
    }
}
