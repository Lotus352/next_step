package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.CompanyRequest;
import org.example.next_step.dtos.responses.CompanyResponse;
import org.example.next_step.models.Company;
import org.example.next_step.models.Industry;
import org.example.next_step.repositories.IndustryRepository;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class CompanyMapper {

    public static CompanyResponse toDTO(Company company) {
        if (company == null) {
            return null;
        }
        return CompanyResponse.builder()
                .companyId(company.getCompanyId())
                .name(company.getName())
                .description(company.getDescription())
                .location(company.getLocation() != null ? LocationMapper.toDTO(company.getLocation()) : null) // ✅ Sử dụng LocationMapper
                .zipCode(company.getZipCode())
                .companyUrl(company.getCompanyUrl())
                .logoUrl(company.getLogoUrl())
                .countEmployees(company.getCountEmployees())
                .isDeleted(company.getIsDeleted())
                .specialities(company.getSpecialities() != null ? company.getSpecialities() : new HashSet<>())
                .industries(company.getIndustries() != null ? company.getIndustries().stream().map(IndustryMapper::toDTO).collect(Collectors.toSet()) : null)
                .averageRating(company.getAverageRating())
                .countReview(company.getCountReview())
                .countJobOpening(company.getCountJobOpening())
                .founded(company.getFounded() != null ? company.getFounded() : null)
                .build();
    }

    public static Company toEntity(CompanyRequest request, IndustryRepository industryRepository) {
        if (request == null) {
            return null;
        }
        Company company = new Company();
        company.setName(request.getName());
        company.setDescription(request.getDescription());
        company.setZipCode(request.getZipCode());
        company.setCountEmployees(request.getCountEmployees());
        company.setCompanyUrl(request.getCompanyUrl());
        company.setLogoUrl(request.getLogoUrl());
        company.setIsDeleted(request.getIsDeleted() != null ? request.getIsDeleted() : false);
        company.setSpecialities(request.getSpecialities() != null ? request.getSpecialities() : new HashSet<>());

        if (request.getLocation() != null) {
            company.setLocation(LocationMapper.toEntity(request.getLocation())); // ✅ Chuyển đổi từ LocationRequest thành Location
        }

        if (request.getIndustryIds() != null && !request.getIndustryIds().isEmpty()) {
            Set<Industry> industries = new HashSet<>(industryRepository.findAllById(request.getIndustryIds()));
            company.setIndustries(industries);
        }
        return company;
    }

    public static void updateEntity(Company company, CompanyRequest request, IndustryRepository industryRepository) {
        if (request == null) {
            return;
        }

        if (request.getName() != null) {
            company.setName(request.getName());
        }
        if (request.getDescription() != null) {
            company.setDescription(request.getDescription());
        }
        if (request.getZipCode() != null) {
            company.setZipCode(request.getZipCode());
        }
        if (request.getCountEmployees() != null) {
            company.setCountEmployees(request.getCountEmployees());
        }
        if (request.getCompanyUrl() != null) {
            company.setCompanyUrl(request.getCompanyUrl());
        }
        if (request.getLogoUrl() != null) {
            company.setLogoUrl(request.getLogoUrl());
        }
        if (request.getIsDeleted() != null) {
            company.setIsDeleted(request.getIsDeleted());
        }
        if (request.getSpecialities() != null) {
            company.setSpecialities(request.getSpecialities());
        }

        if (request.getLocation() != null) {
            if (company.getLocation() == null) {
                company.setLocation(LocationMapper.toEntity(request.getLocation()));
            } else {
                LocationMapper.updateEntity(company.getLocation(), request.getLocation());
            }
        }

        if (request.getIndustryIds() != null) {
            Set<Industry> industries = new HashSet<>(industryRepository.findAllById(request.getIndustryIds()));
            company.setIndustries(industries);
        }
    }
}
