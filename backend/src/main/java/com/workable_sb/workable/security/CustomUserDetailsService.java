package com.workable_sb.workable.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.ReclutadorRepo;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Servicio personalizado para cargar detalles del usuario durante la autenticación.
 * Integra los modelos Aspirante y Reclutador con Spring Security.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AspiranteRepo aspiranteRepo;

    @Autowired
    private ReclutadorRepo reclutadorRepo;

    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        // Intentar cargar como Aspirante
        Optional<Aspirante> aspirante = aspiranteRepo.findByCorreo(correo);
        if (aspirante.isPresent()) {
            Aspirante user = aspirante.get();
            return buildUserDetails(user.getCorreo(), user.getPassword(), user.getIsActive(), "ASPIRANTE");
        }

        // Intentar cargar como Reclutador
        Optional<Reclutador> reclutador = reclutadorRepo.findByCorreo(correo);
        if (reclutador.isPresent()) {
            Reclutador user = reclutador.get();
            return buildUserDetails(user.getCorreo(), user.getPassword(), user.getIsActive(), "RECLUTADOR");
        }

        // Si no encuentra ninguno, lanzar excepción
        throw new UsernameNotFoundException("Usuario no encontrado con correo: " + correo);
    }

    /**
     * Método auxiliar para construir UserDetails
     */
    private UserDetails buildUserDetails(String correo, String password, Boolean isActive, String rol) {
        // Verificar si el usuario está activo
        if (isActive == null || !isActive) {
            throw new UsernameNotFoundException("Usuario inactivo: " + correo);
        }

        // Crear lista de autoridades (roles)
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + rol));

        // Retornar UserDetails de Spring Security
        return new User(
            correo,
            password,
            true,  // enabled
            true,  // accountNonExpired
            true,  // credentialsNonExpired
            true,  // accountNonLocked
            authorities
        );
    }
}

