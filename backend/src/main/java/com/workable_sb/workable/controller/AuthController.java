package com.workable_sb.workable.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.AspiranteDto;
import com.workable_sb.workable.dto.LoginDto;
import com.workable_sb.workable.dto.LoginResponseDto;
import com.workable_sb.workable.dto.UsuarioDto;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.GeneroRepository;
import com.workable_sb.workable.repository.MunicipioRepository;
import com.workable_sb.workable.repository.TipDocumentoRepository;
import com.workable_sb.workable.repository.UsuarioRepository;
import com.workable_sb.workable.security.JwtUtil;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TipDocumentoRepository tipDocumentoRepository;

    @Autowired
    private MunicipioRepository municipioRepository;

    @Autowired
    private GeneroRepository generoRepository;

@PostMapping("/register")
public ResponseEntity<?> register(@Valid @RequestBody UsuarioDto usuarioDto) {
    if (usuarioRepository.findByCorreo(usuarioDto.getCorreo()).isPresent()) {
        return ResponseEntity.badRequest().body("❌ El correo ya está registrado");
    }

    Usuario usuario = new Usuario();
    usuario.setNombre(usuarioDto.getNombre());
    usuario.setCorreo(usuarioDto.getCorreo());
    usuario.setClave(passwordEncoder.encode(usuarioDto.getClave()));

    usuario.setMunicipio(
        municipioRepository.findById(usuarioDto.getMunicipio_id())
            .orElseThrow(() -> new RuntimeException("Municipio no encontrado"))
    );

    usuario.setGenero(
        generoRepository.findById(usuarioDto.getGenero_id())
            .orElseThrow(() -> new RuntimeException("Género no encontrado"))
    );

    usuario.setNumero_Doc(usuarioDto.getNumDoc());

    usuarioRepository.save(usuario);

    return ResponseEntity.ok("✅ Aspirante registrado con éxito");
}


  @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
    Aspirante aspirante = aspiranteRepository.findByCorreo(loginDto.getCorreo())
            .orElse(null);

    if (aspirante == null || !passwordEncoder.matches(loginDto.getClave(), aspirante.getClave())) {
        return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
    }

    String token = jwtUtil.generateToken(aspirante.getCorreo(), aspirante.getRol());

    LoginResponseDto responseDto = new LoginResponseDto();
    responseDto.setToken(token);
    responseDto.setId(aspirante.getAspiranteId());
    responseDto.setNombre(aspirante.getNombre());
    responseDto.setApellido(aspirante.getApellido());
    responseDto.setCorreo(aspirante.getCorreo());
    responseDto.setUbicacion(aspirante.getUbicacion());
    responseDto.setTelefono(aspirante.getTelefono());
    responseDto.setNombreTipDoc(aspirante.getTipDocumento().getNombre());
    responseDto.setNombreMunicipio(aspirante.getMunicipio().getNombre());
    responseDto.setNombreGenero(aspirante.getGenero().getNombre());

    return ResponseEntity.ok(responseDto);
}
}
