package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.LocationRequest;
import org.example.next_step.dtos.responses.LocationResponse;
import org.example.next_step.models.Location;

public class LocationMapper {

    public static LocationResponse toDTO(Location location) {
        if (location == null) return null;

        return LocationResponse.builder()
                .locationId(location.getLocationId())
                .countryName(location.getCountryName())
                .state(location.getState())
                .city(location.getCity())
                .street(location.getStreet())
                .houseNumber(location.getHouseNumber())
                .build();
    }

    public static Location toEntity(LocationRequest request) {
        if (request == null) return null;

        Location location = new Location();
        location.setLocationId(request.getLocationId());
        location.setCountryName(request.getCountryName());
        location.setState(request.getState());
        location.setCity(request.getCity());
        location.setStreet(request.getStreet());
        location.setHouseNumber(request.getHouseNumber());

        return location;
    }

    public static void updateEntity(Location location, LocationRequest request) {
        if (request == null) return;

        if (request.getCountryName() != null) location.setCountryName(request.getCountryName());
        if (request.getState() != null) location.setState(request.getState());
        if (request.getCity() != null) location.setCity(request.getCity());
        if (request.getStreet() != null) location.setStreet(request.getStreet());
        if (request.getHouseNumber() != null) location.setHouseNumber(request.getHouseNumber());
    }
}
