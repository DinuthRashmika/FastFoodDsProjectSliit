package com.nexests.nexests.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
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
