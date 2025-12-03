package com.workable_sb.workable.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.UsuarioRepo;

import java.util.ArrayList;
import java.util.List;

/**
 * Servicio personalizado para cargar detalles del usuario durante la autenticación.
 * Integra el modelo Usuario con Spring Security.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepo.findByCorreo(correo)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con correo: " + correo));

        // Verificar si el usuario está activo
        if (!usuario.getIsActive()) {
            throw new UsernameNotFoundException("Usuario inactivo: " + correo);
        }

        // Crear lista de autoridades (roles)
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name()));

        // Retornar UserDetails de Spring Security
        return new User(
            usuario.getCorreo(),
            usuario.getPassword(),
            usuario.getIsActive(),
            true, // accountNonExpired
            true, // credentialsNonExpired
            true, // accountNonLocked
            authorities
        );
    }

    /**
     * Obtener el usuario completo desde la base de datos por correo.
     * Útil para operaciones adicionales después de la autenticación.
     */
    public Usuario getUsuarioByCorreo(String correo) {
        return usuarioRepo.findByCorreo(correo)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + correo));
    }
}
