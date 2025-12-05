package com.workable_sb.workable.security;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.workable_sb.workable.exception.JwtAuthenticationException;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filtro que intercepta todas las peticiones HTTP para validar tokens JWT.
 * Se ejecuta una vez por petición antes de los filtros de autenticación de Spring Security.
 */
@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    
    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        
        String path = request.getRequestURI();
        
        // Ignorar rutas públicas (auth endpoints y OPTIONS para CORS)
        if (path.startsWith("/api/auth") || request.getMethod().equals("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extraer token del header Authorization
        final String authHeader = request.getHeader("Authorization");
        String correo = null;
        String jwt = null;
        String rol = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            
            try {
                // Validar que sea un access token (no refresh token)
                if (!jwtUtil.isAccessToken(jwt)) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"error\": \"Token inválido. Usa un access token.\"}");
                    return;
                }
                
                correo = jwtUtil.extractCorreo(jwt);
                rol = jwtUtil.extractRol(jwt);
                
            } catch (JwtAuthenticationException e) {
                // Token malformado, expirado, etc.
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
                return;
            }
        }

        // Si hay correo y no está autenticado aún, validar y autenticar
        if (correo != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            if (jwtUtil.validateToken(jwt, correo)) {

                // Crear lista de autoridades (roles)
                var authorities = new ArrayList<SimpleGrantedAuthority>();
                if (rol != null) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_" + rol));
                }

                // Extraer usuarioId del token
                Long usuarioId = jwtUtil.extractUsuarioId(jwt);

                // Crear CustomUserDetails con usuarioId
                CustomUserDetails userDetails = new CustomUserDetails(correo, "", authorities, usuarioId);

                // Crear token de autenticación de Spring Security
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, 
                    null,
                    authorities
                );

                // Establecer detalles de autenticación
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
