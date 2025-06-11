package org.example.next_step.dtos.responses;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LocationResponse {
    private Long locationId;
    private String countryName;
    private String state;
    private String city;
    private String street;
    private String houseNumber;
}
