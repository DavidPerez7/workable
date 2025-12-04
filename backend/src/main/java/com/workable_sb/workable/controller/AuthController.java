package com.workable_sb.workable.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.LoginRequestDto;
import com.workable_sb.workable.dto.LoginResponseDto;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.UsuarioRepo;
import com.workable_sb.workable.security.JwtUtil;
import com.workable_sb.workable.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // - CREATE (register aspirante)
    @PostMapping("/register-aspirante")
    public ResponseEntity<?> registrarAspirante(@RequestBody Usuario usuario) {
        try {
            if (usuarioRepo.findByCorreo(usuario.getCorreo()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
            }
            // Forzar rol ASPIRANTE
            usuario.setRol(Usuario.Rol.ASPIRANTE);
            Usuario usuarioCreado = usuarioService.createPublic(usuario);
            return ResponseEntity.ok(usuarioCreado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    // - CREATE (register reclutador)
    @PostMapping("/register-reclutador")
    public ResponseEntity<?> registrarReclutador(@RequestBody Usuario usuario) {
        try {
            if (usuarioRepo.findByCorreo(usuario.getCorreo()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
            }
            // Forzar rol RECLUTADOR
            usuario.setRol(Usuario.Rol.RECLUTADOR);
            Usuario usuarioCreado = usuarioService.createPublic(usuario);
            return ResponseEntity.ok(usuarioCreado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    // - CREATE (register admin)
    @PostMapping("/register-admin")
    public ResponseEntity<?> registrarAdmin(@RequestBody Usuario usuario) {
        try {
            if (usuarioRepo.findByCorreo(usuario.getCorreo()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
            }
            Usuario usuarioCreado = usuarioService.create(usuario);
            return ResponseEntity.ok(usuarioCreado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    // - READ (login)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        try {
            Usuario usuario = usuarioRepo.findByCorreo(loginRequest.getCorreo()).orElse(null);
            if (usuario == null || !passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
            }
            
            // Verificar que el usuario esté activo
            if (!usuario.getIsActive()) {
                return ResponseEntity.status(403).body(Map.of("error", "Usuario inactivo"));
            }
            
            String rolString = usuario.getRol().toString();
            String token = jwtUtil.generateToken(usuario.getCorreo(), rolString);
            String refreshToken = jwtUtil.generateRefreshToken(usuario.getCorreo());
            
            LoginResponseDto response = new LoginResponseDto();
            response.setToken(token);
            response.setRefreshToken(refreshToken);
            response.setRol(rolString);
            response.setUsuarioId(usuario.getId());
            response.setNombre(usuario.getNombre());
            response.setCorreo(usuario.getCorreo());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }
}
