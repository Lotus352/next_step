package org.example.next_step.dtos.requests;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobCertificationRequest {
    private Long jobId;
    private Long certificationId;
    private String certificationScore;
}
