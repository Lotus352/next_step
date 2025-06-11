package org.example.next_step.models;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "country_name", nullable = false, length = 255)
    private String countryName;

    @Column(length = 255)
    private String state;

    @Column(length = 255)
    private String city;

    @Column(length = 255)
    private String street;

    @Column(name = "house_number", length = 255)
    private String houseNumber;
}
