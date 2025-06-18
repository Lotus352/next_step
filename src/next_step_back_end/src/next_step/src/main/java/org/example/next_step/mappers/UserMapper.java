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
        return UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .resumeUrl(user.getResumeUrl())
                .status(user.getStatus().toString())
                .phoneNumber(user.getPhoneNumber())
                .bio(user.getBio() != null ? user.getBio() : "")
                .nationality(user.getNationality())
                .isSend(user.getIsSend() != null ? user.getIsSend() : true)
                .roles(user.getRoles().stream().map(RoleMapper::toDTO).collect(Collectors.toSet()))
                .company(CompanyMapper.toDTO(user.getCompany()))
                .experiences(user.getExperiences() != null ?
                        user.getExperiences().stream()
                                .map(UserExperienceMapper::toDTO)
                                .collect(Collectors.toSet()) :
                        new HashSet<>())
                .skills(user.getSkills().stream().map(SkillMapper::toDTO).collect(Collectors.toSet()))
                .build();
    }

    public static User toEntity(UserRequest request, CompanyRepository companyRepo, RoleRepository roleRepo, SkillRepository skillRepo) {
        if (request == null) {
            return null;
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
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
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getIsSend() != null) {
            user.setIsSend(request.getIsSend());
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
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getIsSend() != null) {
            user.setIsSend(request.getIsSend());
        }
        if (request.getExperiences() != null) {
            user.getExperiences().clear();

            Set<UserExperience> newExperiences = request.getExperiences().stream()
                    .map(exp -> {
                        UserExperience entity = UserExperienceMapper.toEntity(exp);
                        entity.setUser(user);
                        return entity;
                    })
                    .collect(Collectors.toSet());

            user.getExperiences().addAll(newExperiences);
        }
    }
}
