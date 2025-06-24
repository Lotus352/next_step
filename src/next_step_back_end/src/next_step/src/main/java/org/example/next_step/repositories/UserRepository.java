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

    @Query("""
                SELECT DISTINCT u FROM User u
                LEFT JOIN u.roles r
                WHERE (:keyword IS NULL OR :keyword = '' OR
                       LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                       LOWER(u.email)    LIKE LOWER(CONCAT('%', :keyword, '%')) OR
                       LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))
                  AND (:role IS NULL OR :role = '' OR r.roleName = :role)
                  AND (:isDeleted IS NULL OR u.isDeleted = :isDeleted)
            """)
    Page<User> findUsersByFilter(@Param("keyword") String keyword, @Param("role") String role, @Param("isDeleted") Boolean isDeleted, Pageable pageable);

}
