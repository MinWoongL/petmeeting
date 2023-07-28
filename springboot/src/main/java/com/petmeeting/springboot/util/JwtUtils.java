package com.petmeeting.springboot.util;

import com.petmeeting.springboot.dto.auth.Token;
import com.petmeeting.springboot.dto.auth.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;

@Slf4j
@Component
@NoArgsConstructor
public class JwtUtils {
    @Value("${jwt.secret_key}")
    private String jwtSecret;
    @Value("${jwt.access_expiration_ms}")
    private long accessExpirationMs;

    @Value("${jwt.refresh_expiration_ms}")
    private long refreshExpirationMs;
    @Value("${jwt.issuer}")
    private String issuer;

    public String generateAccessToken(AuthenticationManager authenticationManager, String userId, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userId, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return makeToken(authentication).getAccessToken();
    }

    public Token generateAccessAndRefreshTokens(AuthenticationManager authenticationManager, String userId, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userId, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        return makeToken(authentication);
    }

    public Token makeToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        Token token = new Token();

        token.setAccessToken(
                Jwts.builder()
                    .setSubject(userPrincipal.getUsername())
                    .setIssuer(issuer)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date((new Date()).getTime() + accessExpirationMs))
                    .claim("id", userPrincipal.getId())
                    .claim("role", userPrincipal.getAuthority())
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact());

        token.setRefreshToken(
                Jwts.builder()
                    .setSubject(userPrincipal.getUsername())
                    .setIssuer(issuer)
                    .setIssuedAt(new Date())
                    .setExpiration(new Date((new Date()).getTime() + refreshExpirationMs))
                    .claim("id", userPrincipal.getId())
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact());

        return token;
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().getSubject();
    }
    public Integer getUserNoFromJwtToken(String token) {
        return (Integer) Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody().get("id");
    }
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    public Integer getUserNo(String token) {
        if (!token.startsWith("Bearer ")) {
            log.error("[토큰 검증] Prefix Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Prefix가 올바르지 않습니다.");
        }
        token = token.substring(7);

        if (!validateJwtToken(token)) {
            log.error("[토큰 검증] Validation Error");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "잘못된 토큰입니다.");
        }

        return getUserNoFromJwtToken(token);
    }
}