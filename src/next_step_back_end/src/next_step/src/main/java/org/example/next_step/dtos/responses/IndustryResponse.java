package org.example.next_step.dtos.responses;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IndustryResponse {
    private Long industryId;
    private String industryName;
    private Integer countJobs;
    private String icon;
}
