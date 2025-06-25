package org.example.next_step.dtos.responses;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CertificationResponse {
    private Long certificationId;
    private String certificationName;
}
