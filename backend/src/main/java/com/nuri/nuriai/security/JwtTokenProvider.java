package com.nuri.nuriai.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final Key key;

    public JwtTokenProvider(Key secretKey) {
        this.key = secretKey;
    }

    public String createToken(String userId) {
        Date now = new Date();
        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + 3600000)) // 1시간
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}