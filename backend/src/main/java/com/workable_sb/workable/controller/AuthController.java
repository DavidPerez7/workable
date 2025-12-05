package com.workable_sb.workable.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador de autenticación para registro y login de usuarios.
 * Endpoints públicos que no requieren JWT.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Registra un nuevo aspirante.
     * Endpoint público.
     */
    @PostMapping("/register-aspirante")
    public ResponseEntity<?> registrarAspirante(@RequestBody Usuario request) {
        try {
            log.info("Intentando registrar aspirante con correo: {}", request.getCorreo());
            
            if (usuarioRepo.findByCorreo(request.getCorreo()).isPresent()) {
                log.warn("Intento de registro con correo existente: {}", request.getCorreo());
                return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
            }

            // Forzar rol ASPIRANTE
            request.setRol(Usuario.Rol.ASPIRANTE);
            Usuario usuarioCreado = usuarioService.createPublic(request);
            
            log.info("Aspirante registrado exitosamente: {} {}", usuarioCreado.getNombre(), usuarioCreado.getApellido());
            return ResponseEntity.ok(usuarioCreado);

        } catch (Exception e) {
            log.error("Error al registrar aspirante: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    /**
     * Registra un nuevo reclutador.
     * Endpoint público.
     */
    @PostMapping("/register-reclutador")
    public ResponseEntity<?> registrarReclutador(@RequestBody Usuario request) {
        try {
            log.info("Intentando registrar reclutador con correo: {}", request.getCorreo());
            
            if (usuarioRepo.findByCorreo(request.getCorreo()).isPresent()) {
                log.warn("Intento de registro con correo existente: {}", request.getCorreo());
                return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
            }

            // Forzar rol RECLUTADOR
            request.setRol(Usuario.Rol.RECLUTADOR);
            Usuario usuarioCreado = usuarioService.createPublic(request);
            
            log.info("Reclutador registrado exitosamente: {} {}", usuarioCreado.getNombre(), usuarioCreado.getApellido());
            return ResponseEntity.ok(usuarioCreado);

        } catch (Exception e) {
            log.error("Error al registrar reclutador: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    /**
     * Autentica un usuario y devuelve un token JWT.
     * Endpoint público.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        try {
            log.info("Intento de login: {}", loginRequest.getCorreo());
            
            Usuario usuario = usuarioRepo.findByCorreo(loginRequest.getCorreo()).orElse(null);
            if (usuario == null || !passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
                log.warn("Login fallido para: {}", loginRequest.getCorreo());
                return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
            }
            
            // Verificar que el usuario esté activo
            if (!usuario.getIsActive()) {
                log.warn("Usuario inactivo intenta login: {}", loginRequest.getCorreo());
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
            response.setApellido(usuario.getApellido());
            response.setCorreo(usuario.getCorreo());
            
            log.info("Login exitoso para usuario: {} (ID: {})", usuario.getCorreo(), usuario.getId());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error en login: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    /**
     * Obtiene el perfil del usuario autenticado actualmente.
     * Requiere JWT válido.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
            }
            
            String correo = authentication.getName();
            Usuario usuario = usuarioRepo.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // No devolver la contraseña
            usuario.setPassword(null);
            
            return ResponseEntity.ok(usuario);
            
        } catch (Exception e) {
            log.error("Error al obtener usuario actual: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener perfil: " + e.getMessage()));
        }
    }

    /**
     * Refresca el token de acceso usando el refresh token.
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            if (refreshToken == null || refreshToken.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Refresh token requerido"));
            }
            
            // Validar que sea un refresh token
            if (jwtUtil.isAccessToken(refreshToken)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Token inválido. Usa un refresh token"));
            }
            
            String correo = jwtUtil.extractCorreo(refreshToken);
            Usuario usuario = usuarioRepo.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // Generar nuevo access token
            String newAccessToken = jwtUtil.generateToken(correo, usuario.getRol().toString());
            
            return ResponseEntity.ok(Map.of(
                "token", newAccessToken,
                "rol", usuario.getRol().toString()
            ));
            
        } catch (Exception e) {
            log.error("Error al refrescar token: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of("error", "Error al refrescar token: " + e.getMessage()));
        }
    }
}
