package org.example.next_step.dtos.requests;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OauthLoginRequest {
    private Long userId;
    private String provider;
    private String providerUserId;
}
