package org.example.next_step.dtos.responses;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OauthLoginResponse {
    private Long oauthLoginId;
    private Long userId;
    private String provider;
    private String providerUserId;
}
