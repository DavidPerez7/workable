package com.workable_sb.workable.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.login.LoginRequestDto;
import com.workable_sb.workable.dto.login.LoginResponseDto;
import com.workable_sb.workable.dto.usuario.UsrAspiranteDto;
import com.workable_sb.workable.dto.usuario.UsrReclutadorDto;
import com.workable_sb.workable.dto.usuario.UsuarioDto;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.UsrAspiranteRepository;
import com.workable_sb.workable.repository.UsrReclutadorRepository;
import com.workable_sb.workable.repository.UsuarioRepository;
import com.workable_sb.workable.security.JwtUtil;
import com.workable_sb.workable.service.UsuarioService;
import com.workable_sb.workable.service.usuario.UsrAspiranteService;
import com.workable_sb.workable.service.usuario.UsrReclutadorService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsrAspiranteService usrAspiranteService;

    @Autowired
    private UsrReclutadorService usrReclutadorService;

    @Autowired
    private UsrAspiranteRepository usrAspiranteRepo;

    @Autowired
    private UsrReclutadorRepository usrReclutadorRepo;

    @Autowired
    private UsuarioRepository usrRepo;

    @Autowired
    private UsuarioService usrServ;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

@PostMapping("/register-aspirante")
public ResponseEntity<?> registrarAspirante(@Valid @RequestBody UsrAspiranteDto aspiranteDto) {
    if (usrAspiranteRepo.findByCorreo(aspiranteDto.getCorreo()).isPresent()) {
        return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
    }
    try {
        UsrAspiranteDto aspiranteCreado = usrAspiranteService.crear(aspiranteDto);
        
        return ResponseEntity.ok(Map.of(
            "mensaje", "Aspirante registrado con éxito. Por favor, inicia sesión.",
            "rol", "ASPIRANTE",
            "usuario", Map.of(
                "id", aspiranteCreado.getId(),
                "nombre", aspiranteCreado.getNombre(),
                "correo", aspiranteCreado.getCorreo()
            )
        ));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
}

@PostMapping("/register-reclutador")
public ResponseEntity<?> registrarReclutador(@Valid @RequestBody UsrReclutadorDto reclutadorDto) {
    if (usrReclutadorRepo.findByCorreo(reclutadorDto.getCorreo()).isPresent()) {
        return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
    }
    try {
        UsrReclutadorDto reclutadorCreado = usrReclutadorService.crear(reclutadorDto);
        
        return ResponseEntity.ok(Map.of(
            "mensaje", "Reclutador registrado con éxito. Por favor, inicia sesión.",
            "rol", "RECLUTADOR",
            "usuario", Map.of(
                "id", reclutadorCreado.getId(),
                "nombre", reclutadorCreado.getNombre(),
                "correo", reclutadorCreado.getCorreo()
            )
        ));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
}

@PostMapping("/register-admin")
public ResponseEntity<?> registrarAdmin(@Valid @RequestBody UsuarioDto adminDto) {
    if (usrRepo.findByCorreo(adminDto.getCorreo()).isPresent()) {
        return ResponseEntity.badRequest().body(Map.of("error", "El correo ya está registrado"));
    }
    try {
        UsuarioDto adminCreado = usrServ.create(adminDto);
        return ResponseEntity.ok(Map.of(
            "mensaje", "Administrador registrado con éxito. Por favor, inicia sesión.",
            "rol", "ADMIN",
            "usuario", Map.of(
                "id", adminCreado.getId(),
                "nombre", adminCreado.getNombre(),
                "correo", adminCreado.getCorreo()
            )
        ));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
    }
}

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequestDto loginDto) {
    Usuario usuario = usrRepo.findByCorreo(loginDto.getCorreo()).orElse(null);
    if (usuario == null || !passwordEncoder.matches(loginDto.getClave(), usuario.getClave())) {
        return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
    }
    
    // Convertir enum a String para JWT y respuesta
    String rolString = usuario.getRol().toString();
    String token = jwtUtil.generateToken(usuario.getCorreo(), rolString);

    LoginResponseDto responseDto = new LoginResponseDto();
    responseDto.setRol(rolString);
    responseDto.setToken(token);

    return ResponseEntity.ok(responseDto);
}
}
