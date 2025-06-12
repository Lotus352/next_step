package org.example.next_step.dtos.requests;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyRequest {
    private String name;
    private String description;
    private LocationRequest location;
    private String zipCode;
    private String companyUrl;
    private String logoUrl;
    private Boolean isDeleted;
    private Set<String> specialities;
    private Set<Long> industryIds;
    private Set<Long> jobIds;
    private Set<Long> userIds;
    private String countEmployees;
    private String founded;
}
