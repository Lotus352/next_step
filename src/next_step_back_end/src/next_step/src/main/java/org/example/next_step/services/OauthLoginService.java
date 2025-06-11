package org.example.next_step.services;

import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.OauthLoginRequest;
import org.example.next_step.dtos.responses.OauthLoginResponse;
import org.example.next_step.mappers.OauthLoginMapper;
import org.example.next_step.models.OauthLogin;
import org.example.next_step.repositories.OauthLoginRepository;
import org.example.next_step.repositories.UserRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OauthLoginService {

    private final OauthLoginRepository repo;
    private final UserRepository userRepo;

    /* queries */
    public Page<OauthLoginResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id"));
        return repo.findAll(pageable).map(OauthLoginMapper::toDTO);
    }

    public OauthLoginResponse findById(Long id) {
        OauthLogin e = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("OauthLogin not found"));
        return OauthLoginMapper.toDTO(e);
    }

    /* commands */
    @Transactional
    public OauthLoginResponse create(OauthLoginRequest req) {
        OauthLogin e = OauthLoginMapper.toEntity(req, userRepo);
        return OauthLoginMapper.toDTO(repo.save(e));
    }

    @Transactional
    public OauthLoginResponse update(Long id, OauthLoginRequest req) {
        OauthLogin existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("OauthLogin not found"));
        OauthLoginMapper.updateEntity(existing, req, userRepo);
        return OauthLoginMapper.toDTO(repo.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
