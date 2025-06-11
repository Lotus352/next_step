package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.OauthLoginRequest;
import org.example.next_step.dtos.responses.OauthLoginResponse;
import org.example.next_step.models.OauthLogin;
import org.example.next_step.models.User;
import org.example.next_step.repositories.UserRepository;

/**
 * Converts between OauthLogin entity and DTOs.
 */
public class OauthLoginMapper {

    /* entity → dto */
    public static OauthLoginResponse toDTO(OauthLogin e) {
        return OauthLoginResponse.builder()
                .oauthLoginId(e.getOauthLoginId())
                .userId(e.getUser() != null ? e.getUser().getUserId() : null)
                .provider(e.getProvider())
                .providerUserId(e.getProviderUserId())
                .build();
    }

    /* dto → entity */
    public static OauthLogin toEntity(OauthLoginRequest r, UserRepository userRepo) {
        User user = r.getUserId() != null
                ? userRepo.findById(r.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"))
                : null;

        return OauthLogin.builder()
                .user(user)
                .provider(r.getProvider())
                .providerUserId(r.getProviderUserId())
                .build();
    }

    public static void updateEntity(OauthLogin target,
                                    OauthLoginRequest src,
                                    UserRepository userRepo) {

        if (src.getUserId() != null) {
            User user = userRepo.findById(src.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            target.setUser(user);
        }
        target.setProvider(src.getProvider());
        target.setProviderUserId(src.getProviderUserId());
    }

    private OauthLoginMapper() { /* util class */ }
}
