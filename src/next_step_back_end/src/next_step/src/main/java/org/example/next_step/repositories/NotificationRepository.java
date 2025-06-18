package org.example.next_step.repositories;

import org.example.next_step.models.Notification;
import org.example.next_step.models.User;
import org.example.next_step.models.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUser_Username(String username, Pageable pageable);

    @Modifying
    @Query(value = """
    UPDATE notifications n
    JOIN users u ON u.user_id = n.user_id
    SET n.status = 'READ', n.read_at = CURRENT_TIMESTAMP(6)
    WHERE u.username = :username
    """, nativeQuery = true)
    void markAllAsReadByUsername(@Param("username") String username);


    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.username = :username AND n.status = :status")
    long countByUsernameAndStatus(@Param("username") String username, @Param("status") String status);

    void deleteByUserAndJob(User user, Job job);

}
