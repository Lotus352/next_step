package org.example.next_step.dtos.requests;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.*;
import org.example.next_step.configurations.FlexibleDateTimeDeserializer;
import org.example.next_step.dtos.responses.ExperienceLevelResponse;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserExperienceRequest {
    private Long userId;
    private Long experienceId;
    private String title;
    private String company;
    private String location;

    @JsonDeserialize(using = FlexibleDateTimeDeserializer.class)
    private LocalDateTime startDate;

    @JsonDeserialize(using = FlexibleDateTimeDeserializer.class)
    private LocalDateTime endDate;

    private String description;
}
