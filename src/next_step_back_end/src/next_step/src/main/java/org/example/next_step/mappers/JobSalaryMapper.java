package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.JobSalaryRequest;
import org.example.next_step.dtos.responses.JobSalaryRangeResponse;
import org.example.next_step.dtos.responses.JobSalaryResponse;
import org.example.next_step.models.JobSalary;

public class JobSalaryMapper {

    public static JobSalaryResponse toDTO(JobSalary entity) {
        if (entity == null) {
            return null;
        }
        return JobSalaryResponse.builder()
                .salaryId(entity.getSalaryId())
                .minSalary(entity.getMinSalary())
                .maxSalary(entity.getMaxSalary())
                .currency(entity.getCurrency())
                .payPeriod(entity.getPayPeriod())
                .build();
    }

    public static JobSalaryRangeResponse toRangeDTO(JobSalary entity) {
        return new JobSalaryRangeResponse(
                entity.getMinSalary(),
                entity.getMaxSalary()
        );
    }

    public static JobSalary toEntity(JobSalaryRequest request) {
        if (request == null) {
            return null;
        }
        JobSalary salary = new JobSalary();
        salary.setMinSalary(request.getMinSalary());
        salary.setMaxSalary(request.getMaxSalary());
        salary.setCurrency(request.getCurrency());
        salary.setPayPeriod(request.getPayPeriod());
        return salary;
    }

    public static void updateEntity(JobSalary entity, JobSalaryRequest request) {
        if (request == null) {
            return;
        }
        if (request.getMinSalary() != null) {
            entity.setMinSalary(request.getMinSalary());
        }
        if (request.getMaxSalary() != null) {
            entity.setMaxSalary(request.getMaxSalary());
        }
        if (request.getCurrency() != null) {
            entity.setCurrency(request.getCurrency());
        }
        if (request.getPayPeriod() != null) {
            entity.setPayPeriod(request.getPayPeriod());
        }
    }
}
