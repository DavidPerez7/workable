package com.workable_sb.workable.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Manejador de errores de autenticación.
 * Retorna respuesta JSON cuando un usuario no autenticado intenta acceder a recursos protegidos.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                        AuthenticationException authException) throws IOException, ServletException {
        // Use OutputStream (bytes) to avoid triggering Tomcat character converter lazily
        // which in some environments throws ClassNotFoundException for internal classes
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json; charset=UTF-8");

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("error", "No autorizado");
        errorDetails.put("mensaje", "Debes iniciar sesión para acceder a este recurso");
        errorDetails.put("path", request.getRequestURI());
        errorDetails.put("timestamp", System.currentTimeMillis());

        ObjectMapper mapper = new ObjectMapper();
        byte[] bytes = mapper.writeValueAsBytes(errorDetails);
        try {
            response.getOutputStream().write(bytes);
            response.getOutputStream().flush();
        } catch (IOException e) {
            // If writing fails, log minimally and rethrow to allow container to handle
            System.err.println("Error writing auth error response: " + e.getMessage());
            throw e;
        }
    }
}
