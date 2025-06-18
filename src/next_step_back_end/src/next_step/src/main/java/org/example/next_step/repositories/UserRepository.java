package org.example.next_step.repositories;

import org.example.next_step.models.Job;
import org.example.next_step.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.*;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phone);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    @Query("""
                SELECT j FROM User u
                JOIN u.favoriteJobs j
                WHERE u.userId = :userId
                AND j.isDeleted = false
                ORDER BY j.createdAt DESC
            """)
    Page<Job> findFavoriteJobsByUserId(@Param("userId") Long userId, Pageable pageable);
}
