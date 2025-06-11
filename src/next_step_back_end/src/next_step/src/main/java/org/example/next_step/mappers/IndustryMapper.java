package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.IndustryRequest;
import org.example.next_step.dtos.responses.IndustryResponse;
import org.example.next_step.models.Industry;

public class IndustryMapper {

    public static IndustryResponse toDTO(Industry industry) {
        if (industry == null) {
            return null;
        }
        return IndustryResponse.builder().industryId(industry.getIndustryId()).industryName(industry.getIndustryName()).countJobs(industry.getCountJobs()).icon(industry.getIcon()).build();
    }

    public static Industry toEntity(IndustryRequest request) {
        if (request == null) {
            return null;
        }
        Industry industry = new Industry();
        industry.setIndustryName(request.getIndustryName());
        industry.setIcon(request.getIcon());
        return industry;
    }

    public static void updateEntity(Industry entity, IndustryRequest request) {
        if (request == null) {
            return;
        }
        if (request.getIndustryName() != null) {
            entity.setIndustryName(request.getIndustryName());
        }
        if (request.getIcon() != null) {
            entity.setIcon(request.getIcon());
        }
    }
}
