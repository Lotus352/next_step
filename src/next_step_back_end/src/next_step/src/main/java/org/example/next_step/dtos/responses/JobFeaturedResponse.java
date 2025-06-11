package org.example.next_step.dtos.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobFeaturedResponse {
    private Long jobId;
    private String title;
    private String shortDescription;
    private LocationResponse location;
    private String employmentType;
    private String companyName;
    private String companyLogo;
    private Set<SkillResponse> skills;
    private JobSalaryResponse salary;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    private Boolean isFavorite;
}
