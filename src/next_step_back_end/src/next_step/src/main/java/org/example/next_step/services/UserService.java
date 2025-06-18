package org.example.next_step.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.ChangePasswordRequest;
import org.example.next_step.dtos.requests.RegisterRequest;
import org.example.next_step.dtos.requests.UserRequest;
import org.example.next_step.dtos.responses.JobResponse;
import org.example.next_step.dtos.responses.UserResponse;
import org.example.next_step.mappers.JobMapper;
import org.example.next_step.mappers.UserMapper;
import org.example.next_step.models.Job;
import org.example.next_step.models.Role;
import org.example.next_step.models.User;
import org.example.next_step.models.enums.Status;
import org.example.next_step.repositories.CompanyRepository;
import org.example.next_step.repositories.RoleRepository;
import org.example.next_step.repositories.SkillRepository;
import org.example.next_step.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.*;

import java.time.LocalDateTime;
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
    public UserResponse registerUser(RegisterRequest registerRequest) {
        // Validate that username, email, and phone number are unique
        if (userRepo.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepo.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepo.findByPhoneNumber(registerRequest.getPhoneNumber()).isPresent()) {
            throw new RuntimeException("Phone number already exists");
        }

        Role userRole = roleRepo.findByRoleName("CANDIDATE")
                .orElseThrow(() -> new RuntimeException("Default role CANDIDATE not found"));

        Set<Role> roles = Collections.singleton(userRole);

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .phoneNumber(registerRequest.getPhoneNumber())
                .isDeleted(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .skills(Collections.emptySet())
                .status(Status.ACTIVE)
                .roles(roles)
                .build();

        userRepo.save(user);

        return UserMapper.toDTO(user);
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
    public UserResponse updateUserSkills(Long userId, Set<Long> skillIds) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        UserRequest request = UserRequest
                .builder()
                .skillIds(skillIds)
                .build();

        UserMapper.updateEntity(user, request, companyRepo, roleRepo, skillRepo);

        User updatedUser = userRepo.save(user);
        return UserMapper.toDTO(updatedUser);
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

    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepo.existsByUsername(username);
    }

    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepo.existsByEmail(email);
    }

    // NEW: Change password method
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        // Validate that new password and confirm password match
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirm password do not match");
        }

        // Find user
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Ensure new password is different from current password
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());

        userRepo.save(user);
    }

    /* ---------- commands ---------- */

    @Transactional
    public UserResponse create(UserRequest request) {
        User user = UserMapper.toEntity(request, companyRepo, roleRepo, skillRepo);
        User savedUser = userRepo.save(user);
        return UserMapper.toDTO(savedUser);
    }

    @Transactional
    public UserResponse update(Long userId, UserRequest request) {
        User existingUser = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        UserMapper.updateEntity(existingUser, request, companyRepo, roleRepo, skillRepo);

        User updatedUser = userRepo.save(existingUser);
        return UserMapper.toDTO(updatedUser);
    }

    @Transactional
    public void delete(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new IllegalStateException("User is already deleted");
        }

        user.setIsDeleted(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepo.save(user);
    }

    @Transactional(readOnly = true)
    public Page<JobResponse> getFavoriteJobs(Long userId, int page, int size) {
        // Validate user exists
        if (!userRepo.existsById(userId)) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Job> favoriteJobs = userRepo.findFavoriteJobsByUserId(userId, pageable);

        return favoriteJobs.map(job -> JobMapper.toDTO(job, userRepo.findById(userId).get().getUsername()));
    }

    /* ---------- helper ---------- */

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

}
