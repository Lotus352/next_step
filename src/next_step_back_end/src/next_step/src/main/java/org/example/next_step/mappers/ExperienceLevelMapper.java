package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.ExperienceLevelRequest;
import org.example.next_step.dtos.responses.ExperienceLevelResponse;
import org.example.next_step.models.ExperienceLevel;

public class ExperienceLevelMapper {

    public static ExperienceLevelResponse toDTO(ExperienceLevel entity) {
        if (entity == null) return null;
        return ExperienceLevelResponse.builder()
                .experienceId(entity.getExperienceId())
                .experienceName(entity.getExperienceName())
                .build();
    }

    public static ExperienceLevel toEntity(ExperienceLevelRequest request) {
        if (request == null) return null;
        ExperienceLevel level = new ExperienceLevel();
        level.setExperienceName(request.getExperienceName());
        return level;
    }

    public static void updateEntity(ExperienceLevel entity, ExperienceLevelRequest request) {
        if (request == null) return;
        if (request.getExperienceName() != null) {
            entity.setExperienceName(request.getExperienceName());
        }
    }
}
