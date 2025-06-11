package org.example.next_step.repositories;

import org.example.next_step.models.OauthLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OauthLoginRepository extends JpaRepository<OauthLogin, Long> {
}
