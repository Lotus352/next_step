package org.example.next_step.dtos.responses;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobCertificationResponse {
    private Long certificationId;
    private String certificationName;
    private String certificationScore;
}
