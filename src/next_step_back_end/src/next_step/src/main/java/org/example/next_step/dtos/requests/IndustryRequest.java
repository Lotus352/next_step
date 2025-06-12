package org.example.next_step.dtos.requests;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IndustryRequest {
    private String industryName;
    private String icon;
}
