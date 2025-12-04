package com.workable_sb.workable.exception;

import org.springframework.security.core.AuthenticationException;

/**
 * Excepción personalizada para errores de autenticación JWT.
 */
public class JwtAuthenticationException extends AuthenticationException {

    public JwtAuthenticationException(String message) {
        super(message);
    }

    public JwtAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}
