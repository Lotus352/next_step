package org.example.next_step.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.RegisterRequest;
import org.example.next_step.dtos.requests.UserRequest;
import org.example.next_step.dtos.responses.UserResponse;
import org.example.next_step.mappers.UserMapper;
import org.example.next_step.models.Role;
import org.example.next_step.models.User;
import org.example.next_step.repositories.CompanyRepository;
import org.example.next_step.repositories.RoleRepository;
import org.example.next_step.repositories.SkillRepository;
import org.example.next_step.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final CompanyRepository companyRepo;
    private final SkillRepository skillRepo;
    private final PasswordEncoder passwordEncoder;
    private final Cloudinary cloudinary;

    @Transactional
    public void registerUser(RegisterRequest registerRequest) {
        if (userRepo.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        Role userRole = roleRepo.findByRoleName("CANDIDATE")
                .orElseThrow(() -> new RuntimeException("Default role CANDIDATE not found"));

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .roles(Collections.singleton(userRole))
                .build();

        userRepo.save(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toDTO(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toDTO(user);
    }

    @Transactional
    public UserResponse createUser(User user) {
        userRepo.save(user);
        return UserMapper.toDTO(user);
    }

    @Transactional
    public void updateUser(Long userId, UserRequest user) {
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserMapper.updateEntity(existingUser, user, companyRepo, roleRepo, skillRepo);
    }

    @Transactional
    public void updateUserSkills(Long userId, Set<Long> skillIds) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserRequest request = UserRequest.builder()
                .skillIds(skillIds)
                .build();
        UserMapper.updateEntity(user, request, companyRepo, roleRepo, skillRepo);
    }

    @Transactional
    public String uploadAvatar(Long userId, MultipartFile file) {
        String avatarUrl = uploadToCloudinary(file);
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAvatarUrl(avatarUrl);
        userRepo.save(user);
        return avatarUrl;
    }

    @Transactional
    public String uploadResume(Long userId, MultipartFile file) {
        String resumeUrl = uploadToCloudinary(file);
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setResumeUrl(resumeUrl);
        userRepo.save(user);
        return resumeUrl;
    }

    private String uploadToCloudinary(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) throw new IllegalArgumentException("File must not be empty.");
            String original = file.getOriginalFilename().toLowerCase();
            byte[] bytes = file.getBytes();
            String ext = original.substring(original.lastIndexOf('.'));
            String name = "file_" + UUID.randomUUID() + ext;

            Map<String, Object> result = cloudinary.uploader().upload(bytes, ObjectUtils.asMap("resource_type", "raw", "public_id", name));
            return result.get("secure_url").toString();
        } catch (Exception e) {
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deleteUser(Long userId) {
        userRepo.deleteById(userId);
    }

    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepo.existsByUsername(username);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepo.existsByEmail(email);
    }
}
