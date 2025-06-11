package org.example.next_step.dtos.responses;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyResponse {
    private Long companyId;
    private String name;
    private String description;
    private LocationResponse location;
    private String companyUrl;
    private String logoUrl;
    private String zipCode;
    private Boolean isDeleted;
    private Set<String> specialities;
    private String countEmployees;
    private Set<IndustryResponse> industries;
    private String founded;

    //for view
    private Integer countJobOpening;
    private Float averageRating;
    private Integer countReview;
}
