package com.workable_sb.workable.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.LoginResponseDto;
import com.workable_sb.workable.models.Administrador;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.repository.AdministradorRepo;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.ReclutadorRepo;

// SERVICIO DE AUTENTICACIÓN CON JWT
@Service
public class AuthenticationService {

    @Autowired
    private AspiranteRepo aspiranteRepo;

    @Autowired
    private ReclutadorRepo reclutadorRepo;

    @Autowired
    private AdministradorRepo administradorRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponseDto authenticate(String correo, String password) {
        Administrador admin = administradorRepo.findByCorreo(correo).orElse(null);
        if (admin != null) {
            return validarYLoginear(admin.getCorreo(), admin.getPassword(), admin.getId(), 
                                   admin.getNombre(), admin.getApellido(), "ADMIN", null, password);
        }

        Aspirante aspirante = aspiranteRepo.findByCorreo(correo).orElse(null);
        if (aspirante != null) {
            return validarYLoginear(aspirante.getCorreo(), aspirante.getPassword(), aspirante.getId(),
                                   aspirante.getNombre(), aspirante.getApellido(), "ASPIRANTE", null, password);
        }

        Reclutador reclutador = reclutadorRepo.findByCorreo(correo).orElse(null);
        if (reclutador != null) {
            return validarYLoginear(reclutador.getCorreo(), reclutador.getPassword(), reclutador.getId(),
                                   reclutador.getNombre(), reclutador.getApellido(), "RECLUTADOR", reclutador.getEmpresa(), password);
        }

        throw new RuntimeException("Usuario no encontrado");
    }

    private LoginResponseDto validarYLoginear(String correo, String passwordEnBD, Long id, String nombre, 
                                             String apellido, String rol, Object empresa, String passwordIngresada) {
        if (!passwordEncoder.matches(passwordIngresada, passwordEnBD)) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        String token = jwtUtil.generateTokenWithUserId(correo, rol, id);

        LoginResponseDto response = new LoginResponseDto();
        response.setToken(token);
        response.setRol(rol);
        response.setUsuarioId(id);
        response.setNombre(nombre);
        response.setApellido(apellido);
        response.setCorreo(correo);

        if (empresa != null && empresa instanceof com.workable_sb.workable.models.Empresa) {
            com.workable_sb.workable.models.Empresa emp = (com.workable_sb.workable.models.Empresa) empresa;
            response.setEmpresa(java.util.Map.of("id", emp.getId(), "nombre", emp.getNombre()));
        }

        return response;
    }
}
