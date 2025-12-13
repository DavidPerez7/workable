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
import com.workable_sb.workable.models.Administrador;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.repository.AdministradorRepo;
import com.workable_sb.workable.repository.AspiranteRepo;
import com.workable_sb.workable.repository.ReclutadorRepo;
import com.workable_sb.workable.security.JwtUtil;
import com.workable_sb.workable.service.AspiranteService;
import com.workable_sb.workable.service.ReclutadorService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controlador de autenticación para registro y login de usuarios.
 * Endpoints públicos que no requieren JWT.
 * Soporta registro de Aspirantes y Reclutadores.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AspiranteService aspiranteService;

    @Autowired
    private ReclutadorService reclutadorService;

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

    /**
     * Registra un nuevo aspirante.
     * Endpoint público.
     */
    @PostMapping("/register-aspirante")
    public ResponseEntity<?> registrarAspirante(@RequestBody Aspirante request) {
        try {
            log.info("Intentando registrar aspirante con correo: {}", request.getCorreo());
            log.info("Password recibido: {}, Nombre: {}", request.getPassword() != null ? "SÍ" : "NO", request.getNombre());
            
            // Validar campos requeridos
            if (request.getCorreo() == null || request.getCorreo().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo es requerido"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "La contraseña es requerida"));
            }
            if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre es requerido"));
            }
            
            if (aspiranteRepo.findByCorreo(request.getCorreo()).isPresent()) {
                log.warn("Intento de registro con correo existente: {}", request.getCorreo());
                return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
            }

            Aspirante aspiranteCreado = aspiranteService.createPublic(request);
            
            log.info("Aspirante registrado exitosamente: {} {}", aspiranteCreado.getNombre(), aspiranteCreado.getApellido());
            return ResponseEntity.ok(aspiranteCreado);

        } catch (Exception e) {
            log.error("Error al registrar aspirante: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    /**
     * Registra un nuevo reclutador.
     * Endpoint público.
     */
    @PostMapping("/register-reclutador")
    public ResponseEntity<?> registrarReclutador(@RequestBody Reclutador request) {
        try {
            log.info("Intentando registrar reclutador con correo: {}", request.getCorreo());
            log.info("Password recibido: {}, Nombre: {}", request.getPassword() != null ? "SÍ" : "NO", request.getNombre());
            
            // Validar campos requeridos
            if (request.getCorreo() == null || request.getCorreo().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El correo es requerido"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "La contraseña es requerida"));
            }
            if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "El nombre es requerido"));
            }
            
            if (reclutadorRepo.findByCorreo(request.getCorreo()).isPresent()) {
                log.warn("Intento de registro con correo existente: {}", request.getCorreo());
                return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
            }

            Reclutador reclutadorCreado = reclutadorService.createPublic(request);
            
            log.info("Reclutador registrado exitosamente: {} {}", reclutadorCreado.getNombre(), reclutadorCreado.getApellido());
            return ResponseEntity.ok(reclutadorCreado);

        } catch (Exception e) {
            log.error("Error al registrar reclutador: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    /**
     * Autentica un usuario (Aspirante o Reclutador) y devuelve un token JWT.
     * Endpoint público.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequest) {
        try {
            log.info("Intento de login: {}", loginRequest.getCorreo());
            
            // Intentar cargar como Administrador primero
            var administrador = administradorRepo.findByCorreo(loginRequest.getCorreo());
            if (administrador.isPresent()) {
                Administrador user = administrador.get();
                log.debug("Administrador encontrado: {}", user.getCorreo());
                if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                    log.warn("Login fallido para administrador: {} - contraseña no coincide", loginRequest.getCorreo());
                    return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
                }
                if (!user.getIsActive()) {
                    log.warn("Administrador inactivo intenta login: {}", loginRequest.getCorreo());
                    return ResponseEntity.status(403).body(Map.of("error", "Usuario inactivo"));
                }
                
                String rolString = "ADMIN";
                String token = jwtUtil.generateTokenWithUserId(user.getCorreo(), rolString, user.getId());
                
                LoginResponseDto response = new LoginResponseDto();
                response.setToken(token);
                response.setRol(rolString);
                response.setUsuarioId(user.getId());
                response.setNombre(user.getNombre());
                response.setApellido(user.getApellido());
                response.setCorreo(user.getCorreo());
                
                log.info("Login exitoso para administrador: {} (ID: {})", user.getCorreo(), user.getId());
                return ResponseEntity.ok(response);
            }
            
            // Intentar cargar como Aspirante
            var aspirante = aspiranteRepo.findByCorreo(loginRequest.getCorreo());
            if (aspirante.isPresent()) {
                Aspirante user = aspirante.get();
                log.debug("Aspirante encontrado: {}, contraseña hasheada: {}", user.getCorreo(), user.getPassword() != null ? "SÍ" : "NO");
                if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                    log.warn("Login fallido para aspirante: {} - contraseña no coincide", loginRequest.getCorreo());
                    return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
                }
                if (!user.getIsActive()) {
                    log.warn("Aspirante inactivo intenta login: {}", loginRequest.getCorreo());
                    return ResponseEntity.status(403).body(Map.of("error", "Usuario inactivo"));
                }
                
                String rolString = "ASPIRANTE";
                String token = jwtUtil.generateTokenWithUserId(user.getCorreo(), rolString, user.getId());
                
                LoginResponseDto response = new LoginResponseDto();
                response.setToken(token);
                response.setRol(rolString);
                response.setUsuarioId(user.getId());
                response.setNombre(user.getNombre());
                response.setApellido(user.getApellido());
                response.setCorreo(user.getCorreo());
                
                log.info("Login exitoso para aspirante: {} (ID: {})", user.getCorreo(), user.getId());
                return ResponseEntity.ok(response);
            }
            
            // Intentar cargar como Reclutador
            var reclutador = reclutadorRepo.findByCorreo(loginRequest.getCorreo());
            if (reclutador.isPresent()) {
                Reclutador user = reclutador.get();
                log.debug("Reclutador encontrado: {}, contraseña hasheada: {}", user.getCorreo(), user.getPassword() != null ? "SÍ" : "NO");
                log.debug("Contraseña en BD (primeros 20 caracteres): {}", user.getPassword() != null && user.getPassword().length() > 20 ? user.getPassword().substring(0, 20) : user.getPassword());
                
                if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                    log.warn("Login fallido para reclutador: {} - contraseña no coincide", loginRequest.getCorreo());
                    return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
                }
                if (!user.getIsActive()) {
                    log.warn("Reclutador inactivo intenta login: {}", loginRequest.getCorreo());
                    return ResponseEntity.status(403).body(Map.of("error", "Usuario inactivo"));
                }
                
                String rolString = "RECLUTADOR";
                String token = jwtUtil.generateTokenWithUserId(user.getCorreo(), rolString, user.getId());
                
                LoginResponseDto response = new LoginResponseDto();
                response.setToken(token);
                response.setRol(rolString);
                response.setUsuarioId(user.getId());
                response.setNombre(user.getNombre());
                response.setApellido(user.getApellido());
                response.setCorreo(user.getCorreo());
                
                // Agregar información de empresa si existe
                if (user.getEmpresa() != null) {
                    Map<String, Object> empresa = new java.util.HashMap<>();
                    empresa.put("id", user.getEmpresa().getId());
                    empresa.put("nombre", user.getEmpresa().getNombre());
                    response.setEmpresa(empresa);
                }
                
                log.info("Login exitoso para reclutador: {} (ID: {})", user.getCorreo(), user.getId());
                return ResponseEntity.ok(response);
            }
            
            log.warn("Login fallido: usuario no encontrado: {}", loginRequest.getCorreo());
            return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
            
        } catch (Exception e) {
            log.error("Error en login: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Error del sistema: " + e.getMessage()));
        }
    }

    /**
     * Obtiene el perfil del usuario autenticado actualmente.
     * Requiere JWT válido.
     * Soporta Aspirantes y Reclutadores.
     */
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
            log.error("Error al obtener usuario actual: {}", e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener perfil: " + e.getMessage()));
        }
    }
}
