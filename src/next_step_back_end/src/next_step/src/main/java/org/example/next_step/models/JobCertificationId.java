package org.example.next_step.models;

import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobCertificationId implements Serializable {
    private Long job;
    private Long certification;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof JobCertificationId)) return false;
        JobCertificationId that = (JobCertificationId) o;
        return Objects.equals(job, that.job) &&
                Objects.equals(certification, that.certification);
    }

    @Override
    public int hashCode() {
        return Objects.hash(job, certification);
    }
}
