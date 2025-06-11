package org.example.next_step.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CertificationRequest {

    @NotBlank
    @Size(max = 45)
    private String certificationsName;
}
