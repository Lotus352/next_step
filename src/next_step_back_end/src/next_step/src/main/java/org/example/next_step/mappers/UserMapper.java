package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.UserRequest;
import org.example.next_step.dtos.responses.UserResponse;
import org.example.next_step.models.*;
import org.example.next_step.models.enums.Status;
import org.example.next_step.repositories.*;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserResponse toDTO(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .userId(user.getUserId())
                .roles(user.getRoles().stream().map(RoleMapper::toDTO).collect(Collectors.toSet()))
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .resumeUrl(user.getResumeUrl())
                .status(user.getStatus() != null ? user.getStatus().toString() : null)
                .phoneNumber(user.getPhoneNumber())
                .nationality(user.getNationality())
                .company(user.getCompany() != null ? CompanyMapper.toDTO(user.getCompany()) : null)
                .experienceLevel(user.getExperienceLevel() != null ? ExperienceLevelMapper.toDTO(user.getExperienceLevel()) : null)
                .skills(user.getSkills() != null ? user.getSkills().stream().map(SkillMapper::toDTO).collect(Collectors.toSet()) : null)
                .build();
    }

    public static User toEntity(UserRequest request, CompanyRepository companyRepo, RoleRepository roleRepo, SkillRepository skillRepo) {
        if (request == null) {
            return null;
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword());
        user.setFullName(request.getFullName());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setResumeUrl(request.getResumeUrl());

        if (request.getStatus() != null) {
            user.setStatus(Status.valueOf(request.getStatus().name()));
        }
        if (request.getCompanyId() != null) {
            user.setCompany(companyRepo.findById(request.getCompanyId()).orElse(null));
        }
        if (request.getNationality() != null) {
            user.setNationality(request.getNationality());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
            Set<Skill> skills = new HashSet<>(skillRepo.findAllById(request.getSkillIds()));
            user.setSkills(skills);
        }
        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            user.setRoles(new HashSet<>(roleRepo.findAllById(request.getRoleIds())));
        }
        return user;
    }

    public static void updateEntity(User user, UserRequest request, CompanyRepository companyRepo, RoleRepository roleRepo, SkillRepository skillRepo) {
        if (request == null) return;

        if (request.getUsername() != null) user.setUsername(request.getUsername());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getResumeUrl() != null) user.setResumeUrl(request.getResumeUrl());
        if (request.getStatus() != null) user.setStatus(Status.valueOf(request.getStatus().name()));
        if (request.getNationality() != null) {
            user.setNationality(request.getNationality());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getCompanyId() != null) {
            user.setCompany(companyRepo.findById(request.getCompanyId()).orElse(null));
        }
        if (request.getSkillIds() != null && !request.getSkillIds().isEmpty()) {
            user.setSkills(new HashSet<>(skillRepo.findAllById(request.getSkillIds())));
        }
        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            user.setRoles(new HashSet<>(roleRepo.findAllById(request.getRoleIds())));
        }
    }
}
