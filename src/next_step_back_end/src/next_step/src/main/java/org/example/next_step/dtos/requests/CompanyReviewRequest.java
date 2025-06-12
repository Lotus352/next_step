package org.example.next_step.dtos.requests;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CompanyReviewRequest {
    private Long companyId;
    private Long userId;
    private Float rating;
    private String reviewText;
}
