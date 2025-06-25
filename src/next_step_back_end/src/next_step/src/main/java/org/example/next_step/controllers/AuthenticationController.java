package org.example.next_step.controllers;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.next_step.dtos.requests.AuthRequest;
import org.example.next_step.dtos.requests.RegisterRequest;
import org.example.next_step.dtos.responses.AuthResponse;
import org.example.next_step.dtos.responses.UserResponse;
import org.example.next_step.security.JwtTokenProvider;
import org.example.next_step.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/auth", produces = "application/json")
@RequiredArgsConstructor
@Validated
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequest request, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

            addRefreshTokenCookie(response, refreshToken);
            return ResponseEntity.ok(new AuthResponse(accessToken));

        } catch (DisabledException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User account is deleted");
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User account is inactive");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request, HttpServletResponse response) {
        userService.registerUser(request);

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        addRefreshTokenCookie(response, refreshToken);
        return ResponseEntity.ok(new AuthResponse(accessToken));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@CookieValue(name = "refreshToken", defaultValue = "") String oldToken, HttpServletResponse response) {

        if (!jwtTokenProvider.validateToken(oldToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthResponse("Invalid or expired token"));
        }

        String username = jwtTokenProvider.extractUsername(oldToken);
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, null);

        String newAccessToken = jwtTokenProvider.generateAccessToken(authentication);
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(authentication);

        addRefreshTokenCookie(response, newRefreshToken);
        return ResponseEntity.ok(new AuthResponse(newAccessToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // invalidate cookie
        addRefreshTokenCookie(response, "", 0);
        return ResponseEntity.noContent().build();
    }

    /* ---------- private helpers ---------- */

    private void addRefreshTokenCookie(HttpServletResponse response, String token) {
        addRefreshTokenCookie(response, token, 60 * 60 * 24 * 7);
    }

    private void addRefreshTokenCookie(HttpServletResponse response, String token, long maxAge) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", token).httpOnly(true).secure(true).path("/").maxAge(maxAge).build();
        response.addHeader("Set-Cookie", cookie.toString());
    }
}
