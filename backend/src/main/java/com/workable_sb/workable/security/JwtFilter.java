package com.workable_sb.workable.security;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Ignorar rutas públicas, sin token
        if (path.startsWith("/api/auth") || 
            (path.equals("/api/aspirante") && method.equals("POST"))) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extraer y validar el token JWT
        final String authHeader = request.getHeader("Authorization");
        String correo = null;
        String jwt = null;
        String rol = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            correo = jwtUtil.extractCorreo(jwt);
            rol = jwtUtil.extractRol(jwt);
        }

        // Validar si el token existe y no ha sido autenticado aún
        if (correo != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            if (jwtUtil.validateToken(jwt, correo)) {

                // Crear la lista de autoridades para roles
                var authorities = new ArrayList<SimpleGrantedAuthority>();
                if (rol != null) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + rol));
                }

                // crear token de autenticación
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    new User(correo, "", authorities), null, authorities
                );

                // Establecer detalles de autenticación
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
