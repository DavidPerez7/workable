package com.workable_sb.workable.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.workable_sb.workable.exception.JwtAuthenticationException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import java.security.Key;

// Manejo de tokens JWT
@Service
public class JwtUtil {

    // Inyectar desde application.properties
    @Value("${jwt.secret:mi_clave_super_secreta_muy_larga_que_tenga_al_menos_32_bytes}")
    private String SECRET_KEY;
    
    @Value("${jwt.expiration:36000000}")
    private long EXPIRATION_TIME;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    // Genera access token
    public String generateToken(String correo, String rol) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", rol);
        claims.put("type", "access");
        return createToken(claims, correo, EXPIRATION_TIME);
    }

    // Genera access token con ID de usuario
    public String generateTokenWithUserId(String correo, String rol, Long usuarioId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("rol", rol);
        claims.put("type", "access");
        claims.put("usuarioId", usuarioId);
        return createToken(claims, correo, EXPIRATION_TIME);
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationTime) {
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
    }

    public String extractRol(String token) {
        return extractClaim(token, claims -> claims.get("rol", String.class));
    }

    public String extractCorreo(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUsuarioId(String token) {
        return extractClaim(token, claims -> claims.get("usuarioId", Long.class));
    }

    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Valida que el token sea válido
    public boolean validateToken(String token, String correo) {
        try {
            String username = extractCorreo(token);
            return (username.equals(correo) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isAccessToken(String token) {
        try {
            String type = extractTokenType(token);
            return "access".equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    // Extrae todos los claims del token
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        } catch (ExpiredJwtException e) {
            throw new JwtAuthenticationException("Token expirado", e);
        } catch (UnsupportedJwtException e) {
            throw new JwtAuthenticationException("Token no soportado", e);
        } catch (MalformedJwtException e) {
            throw new JwtAuthenticationException("Token malformado", e);
        } catch (SignatureException e) {
            throw new JwtAuthenticationException("Firma del token inválida", e);
        } catch (JwtException e) {
            throw new JwtAuthenticationException("Error al procesar el token", e);
        }
    }

    private boolean isTokenExpired(String token) {
        try {
            return extractAllClaims(token).getExpiration().before(new Date());
        } catch (JwtAuthenticationException e) {
            return true;
        }
    }

    public Date getExpirationDate(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
