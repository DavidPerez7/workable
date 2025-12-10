package com.workable_sb.workable.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Servicio para validar si el usuario autenticado tiene permisos de administrador.
 * Lee el rol desde el SecurityContext para garantizar validación segura basada en el token JWT.
 */
@Service
public class AdminValidationService {

    /**
     * Comprueba si el usuario actualmente autenticado tiene el rol de ADMIN.
     * @return true si el usuario es ADMIN, false en caso contrario.
     */
    public boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getAuthorities() == null) {
            return false;
        }
        return auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }
}