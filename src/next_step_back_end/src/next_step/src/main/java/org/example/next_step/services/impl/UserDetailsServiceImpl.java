package org.example.next_step.services.impl;

import lombok.RequiredArgsConstructor;
import org.example.next_step.models.User;
import org.example.next_step.models.enums.Status;
import org.example.next_step.repositories.UserRepository;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (Boolean.TRUE.equals(user.getIsDeleted())) {
            throw new DisabledException("User account is deleted");
        }

        if (user.getStatus() == Status.INACTIVE) {
            throw new DisabledException("User account is inactive");
        }

        if (user.getStatus() == Status.BANNED) {
            throw new DisabledException("User account is banned");
        }

        return user;
    }
}
