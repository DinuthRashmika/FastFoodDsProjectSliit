package com.nexests.nexests.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
    private final SecretKey secretKey;

    public JwtService() {
        try{
            SecretKey k = KeyGenerator.getInstance("HmacSHA256").generateKey();
            secretKey = Keys.hmacShaKeyFor(k.getEncoded());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    public String generateToken(String username, Map<String,Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(secretKey)
                .compact();
    }

    public String generateToken2(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() +1000 * 60 * 60 * 24 );

        return Jwts.builder()
                .setSubject(oAuth2User.getAttribute("email"))
                .claim("name", oAuth2User.getAttribute("name"))
                .claim("userId", oAuth2User.getAttribute("sub"))
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = getTokenData(token);
        if (claims == null) {
            return null;

        }
        return claims.getSubject();
    }

    public Object getFiledFromToken (String token,String filed) {
        Claims claims = getTokenData(token);
        if (claims == null) {
            return null;

        }
        return claims.get(filed);
    }

    public Claims getTokenData(String token) {
        try{
            return Jwts.parser()
                    .setSigningKey(secretKey)
                    .parseClaimsJws(token)
                    .getBody();
        }catch (Exception e) {
            return null;
        }
    }

}
