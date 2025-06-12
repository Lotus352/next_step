package org.example.next_step.dtos.requests;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.example.next_step.models.enums.Status;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserRequest {
    private String username;
    private String email;
    private String fullName;
    private String avatarUrl;
    private String resumeUrl;
    private String phoneNumber;
    private String nationality;
    private String bio;
    @Enumerated(EnumType.STRING)
    private Status status;

    private Long companyId;
    private Set<Long> skillIds;
    private Set<Long> roleIds;
    private Set<UserExperienceRequest> experiences;
}
