package com.workable_sb.workable.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.workable_sb.workable.dto.LoginRequestDto;
import com.workable_sb.workable.dto.LoginResponseDto;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.ReclutadorRepo;
import com.workable_sb.workable.security.AuthenticationService;
import com.workable_sb.workable.service.AspiranteService;
import com.workable_sb.workable.service.ReclutadorService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AspiranteService aspiranteService;

    @Autowired
    private ReclutadorService reclutadorService;

    @Autowired
    private AspiranteRepo aspiranteRepo;

    @Autowired
    private ReclutadorRepo reclutadorRepo;

    @Autowired
    private AuthenticationService authenticationService;

    // REGISTRAR ASPIRANTE
    @PostMapping("/register-aspirante")
    public ResponseEntity<?> registrarAspirante(@RequestBody Aspirante request) {
        try {
            if (aspiranteRepo.findByCorreo(request.getCorreo()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
            }
            Aspirante aspiranteCreado = aspiranteService.create(request);
            return ResponseEntity.ok(aspiranteCreado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    // REGISTRAR RECLUTADOR
    @PostMapping("/register-reclutador")
    public ResponseEntity<?> registrarReclutador(@RequestBody Reclutador request) {
        try {
            if (reclutadorRepo.findByCorreo(request.getCorreo()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
            }
            Reclutador reclutadorCreado = reclutadorService.create(request);
            return ResponseEntity.ok(reclutadorCreado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    // LOGIN - AUTENTICACIÓN CON JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        try {
            LoginResponseDto response = authenticationService.authenticate(loginRequest.getCorreo(), loginRequest.getPassword());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    // OBTENER PERFIL ACTUAL
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
            }
            String correo = authentication.getName();
            
            // Intentar cargar como Aspirante
            var aspirante = aspiranteRepo.findByCorreo(correo);
            if (aspirante.isPresent()) {
                Aspirante user = aspirante.get();
                user.setPassword(null);
                return ResponseEntity.ok(user);
            }
            
            // Intentar cargar como Reclutador
            var reclutador = reclutadorRepo.findByCorreo(correo);
            if (reclutador.isPresent()) {
                Reclutador user = reclutador.get();
                user.setPassword(null);
                return ResponseEntity.ok(user);
            }
            
            return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener perfil: " + e.getMessage()));
        }
    }
}
