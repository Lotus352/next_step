package org.example.next_step.mappers;

import org.example.next_step.dtos.requests.CompanyReviewRequest;
import org.example.next_step.dtos.responses.CompanyReviewResponse;
import org.example.next_step.models.Company;
import org.example.next_step.models.CompanyReview;
import org.example.next_step.models.User;
import org.example.next_step.repositories.CompanyRepository;
import org.example.next_step.repositories.UserRepository;
import java.time.LocalDateTime;

public class CompanyReviewMapper {

    public static CompanyReviewResponse toDTO(CompanyReview review) {
        if (review == null) return null;
        return CompanyReviewResponse.builder()
                .reviewId(review.getReviewId())
                .company(review.getCompany() != null ? CompanyMapper.toDTO(review.getCompany()) : null)
                .user(review.getUser() != null ? UserMapper.toDTO(review.getUser()) : null)
                .rating(review.getRating())
                .reviewText(review.getReviewText())
                .createdAt(review.getCreatedAt())
                .build();
    }

    public static CompanyReview toEntity(CompanyReviewRequest request,
                                         CompanyRepository companyRepo,
                                         UserRepository userRepo) {
        if (request == null) return null;
        CompanyReview review = new CompanyReview();
        if (request.getCompanyId() != null) {
            Company c = companyRepo.findById(request.getCompanyId()).orElse(null);
            review.setCompany(c);
        }
        if (request.getUserId() != null) {
            User u = userRepo.findById(request.getUserId()).orElse(null);
            review.setUser(u);
        }
        review.setRating(request.getRating());
        review.setReviewText(request.getReviewText());
        review.setCreatedAt(LocalDateTime.now());

        System.out.println("review:" + review.getReviewText());
        return review;
    }

    public static void updateEntity(CompanyReview review,
                                    CompanyReviewRequest request,
                                    CompanyRepository companyRepo,
                                    UserRepository userRepo) {
        if (request == null) return;
        if (request.getCompanyId() != null) {
            Company c = companyRepo.findById(request.getCompanyId()).orElse(null);
            review.setCompany(c);
        }
        if (request.getUserId() != null) {
            User u = userRepo.findById(request.getUserId()).orElse(null);
            review.setUser(u);
        }
        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }
        if (request.getReviewText() != null) {
            review.setReviewText(request.getReviewText());
        }
    }
}
