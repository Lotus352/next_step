package org.example.next_step.models;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserExperienceId implements Serializable {

    private Long userId;
    private Long experienceId;

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        UserExperienceId that = (UserExperienceId) obj;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(experienceId, that.experienceId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, experienceId);
    }
}