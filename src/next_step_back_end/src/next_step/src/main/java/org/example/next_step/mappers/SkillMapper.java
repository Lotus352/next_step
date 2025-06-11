package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.SkillRequest;
import org.example.next_step.dtos.responses.SkillResponse;
import org.example.next_step.models.Skill;

public class SkillMapper {

    public static SkillResponse toDTO(Skill skill) {
        if (skill == null) return null;
        return SkillResponse.builder()
                .skillId(skill.getSkillId())
                .skillName(skill.getSkillName())
                .build();
    }

    public static Skill toEntity(SkillRequest request) {
        if (request == null) return null;
        Skill skill = new Skill();
        skill.setSkillName(request.getSkillName());
        return skill;
    }

    public static void updateEntity(Skill skill, SkillRequest request) {
        if (request == null) return;
        if (request.getSkillName() != null) {
            skill.setSkillName(request.getSkillName());
        }
    }
}
