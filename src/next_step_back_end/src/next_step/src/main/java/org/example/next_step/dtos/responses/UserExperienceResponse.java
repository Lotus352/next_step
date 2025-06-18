package org.example.next_step.dtos.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.example.next_step.dtos.requests.ExperienceLevelRequest;
import org.example.next_step.models.ExperienceLevel;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserExperienceResponse {
    private Long userId;
    private Long experienceId;
    private String title;
    private String company;
    private String location;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;
    private String description;
    private ExperienceLevelResponse experienceLevel;
}