package org.example.next_step.dtos.responses;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private Long userId;
    private Set<RoleResponse> roles;
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String resumeUrl;
    private String status;
    private String bio;
    private String phoneNumber;
    private String nationality;
    private CompanyResponse company;
    private Set<UserExperienceResponse> experiences;
    private Set<SkillResponse> skills;
}
