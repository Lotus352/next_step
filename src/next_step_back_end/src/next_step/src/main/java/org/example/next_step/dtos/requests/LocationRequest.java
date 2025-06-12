package org.example.next_step.dtos.requests;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LocationRequest {
    private String countryName;
    private String state;
    private String city;
    private String street;
    private String houseNumber;
}
