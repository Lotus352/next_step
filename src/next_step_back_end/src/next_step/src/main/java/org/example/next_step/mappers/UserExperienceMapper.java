package org.example.next_step.mappers;

import org.example.next_step.dtos.responses.UserExperienceResponse;
import org.example.next_step.models.UserExperience;

public class UserExperienceMapper {

    public static UserExperienceResponse toDTO(UserExperience userExperience) {
        if (userExperience == null) {
            return null;
        }

        return UserExperienceResponse.builder()
                .userId(userExperience.getUserId())
                .experienceId(userExperience.getExperienceId())
                .title(userExperience.getTitle())
                .company(userExperience.getCompany())
                .location(userExperience.getLocation())
                .startDate(userExperience.getStartDate())
                .endDate(userExperience.getEndDate())
                .description(userExperience.getDescription())
                .experienceLevel(userExperience.getExperienceLevel() != null ?
                        ExperienceLevelMapper.toDTO(userExperience.getExperienceLevel()) : null)
                .build();
    }

    public static UserExperience toEntity(UserExperienceResponse dto) {
        if (dto == null) {
            return null;
        }

        return UserExperience.builder()
                .userId(dto.getUserId())
                .experienceId(dto.getExperienceId())
                .title(dto.getTitle())
                .company(dto.getCompany())
                .location(dto.getLocation())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .description(dto.getDescription())
                .build();
    }
}