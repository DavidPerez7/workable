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
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.repository.AspiranteRepository;
import com.workable_sb.workable.repository.GeneroRepository;
import com.workable_sb.workable.repository.MunicipioRepository;
import com.workable_sb.workable.repository.TipDocumentoRepository;
import com.workable_sb.workable.security.JwtUtil;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    

    @Autowired
    private AspiranteRepository aspiranteRepository;

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
    
    @Autowired
    private com.workable_sb.workable.repository.ReclutadorRepository reclutadorRepository;

    @Autowired
    private com.workable_sb.workable.repository.EmpresaRepository empresaRepository;

@PostMapping("/register")
public ResponseEntity<?> register(@Valid @RequestBody AspiranteDto aspiranteDto) {
    if (aspiranteRepository.findByCorreo(aspiranteDto.getCorr()).isPresent()) {
        return ResponseEntity.badRequest().body("❌ El correo ya está registrado");
    }

    Aspirante aspirante = new Aspirante();
    aspirante.setNombre(aspiranteDto.getNom());
    aspirante.setApellido(aspiranteDto.getApe());
    aspirante.setCorreo(aspiranteDto.getCorr());
    aspirante.setUbicacion(aspiranteDto.getUbi());
    aspirante.setTelefono(aspiranteDto.getTel());
    aspirante.setFecha_Nacimiento(aspiranteDto.getFeNa());
    aspirante.setClave(passwordEncoder.encode(aspiranteDto.getCla()));

    aspirante.setTipDocumento(
        tipDocumentoRepository.findById(aspiranteDto.getTipDoc_id())
            .orElseThrow(() -> new RuntimeException("TipoDocumento no encontrado"))
    );

    aspirante.setMunicipio(
        municipioRepository.findById(aspiranteDto.getMunici_id())
            .orElseThrow(() -> new RuntimeException("Municipio no encontrado"))
    );

    aspirante.setGenero(
        generoRepository.findById(aspiranteDto.getGenero_id())
            .orElseThrow(() -> new RuntimeException("Género no encontrado"))
    );

    aspirante.setNumero_Doc(aspiranteDto.getNumDoc());

    aspiranteRepository.save(aspirante);

    return ResponseEntity.ok("✅ Aspirante registrado con éxito");
}


  @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
    // Buscar aspirante primero
    Aspirante aspirante = aspiranteRepository.findByCorreo(loginDto.getCorreo()).orElse(null);

    if (aspirante != null && passwordEncoder.matches(loginDto.getClave(), aspirante.getClave())) {
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
        responseDto.setRole(aspirante.getRol());
        return ResponseEntity.ok(responseDto);
    }

    // Si no es aspirante, buscar reclutador por correo personal
    java.util.Optional<com.workable_sb.workable.models.Reclutador> maybeReclutador = reclutadorRepository.findByCorreo(loginDto.getCorreo());
    if (maybeReclutador.isPresent()) {
        com.workable_sb.workable.models.Reclutador reclutador = maybeReclutador.get();
        if (passwordEncoder.matches(loginDto.getClave(), reclutador.getClave())) {
            String token = jwtUtil.generateToken(reclutador.getCorreo(), "RECLUTADOR");
            LoginResponseDto responseDto = new LoginResponseDto();
            responseDto.setToken(token);
            responseDto.setId(reclutador.getReclutador_id());
            responseDto.setNombre(reclutador.getNombre());
            responseDto.setApellido("");
            responseDto.setCorreo(reclutador.getCorreo());
            responseDto.setTelefono(reclutador.getTelefono());
            responseDto.setRole("RECLUTADOR");
            if (reclutador.getEmpresa() != null) {
                Long nitId = reclutador.getEmpresa().getNitId();
                System.out.println("🏢 Login Reclutador - Empresa NIT: " + nitId);
                if (nitId != null) {
                    responseDto.setEmpresaId(nitId.intValue());
                    System.out.println("✅ EmpresaId establecido en response: " + nitId.intValue());
                } else {
                    System.out.println("⚠️ NIT es null");
                }
            } else {
                System.out.println("⚠️ Reclutador no tiene empresa asociada");
            }
            System.out.println("📤 Enviando response con empresaId: " + responseDto.getEmpresaId());
            return ResponseEntity.ok(responseDto);
        }
    }

    // Si no se encuentra por correo personal, buscar por correo corporativo de la empresa
    java.util.Optional<com.workable_sb.workable.models.Empresa> maybeEmpresa = empresaRepository.findByCorreoCorporativo(loginDto.getCorreo());
    if (maybeEmpresa.isPresent()) {
        com.workable_sb.workable.models.Empresa empresa = maybeEmpresa.get();
        // Buscar reclutadores de esta empresa usando el repositorio
        java.util.List<com.workable_sb.workable.models.Reclutador> reclutadores = reclutadorRepository.findAllByEmpresa(empresa);
        for (com.workable_sb.workable.models.Reclutador reclutador : reclutadores) {
            if (passwordEncoder.matches(loginDto.getClave(), reclutador.getClave())) {
                String token = jwtUtil.generateToken(reclutador.getCorreo(), "RECLUTADOR");
                LoginResponseDto responseDto = new LoginResponseDto();
                responseDto.setToken(token);
                responseDto.setId(reclutador.getReclutador_id());
                responseDto.setNombre(reclutador.getNombre());
                responseDto.setApellido("");
                responseDto.setCorreo(reclutador.getCorreo());
                responseDto.setTelefono(reclutador.getTelefono());
                responseDto.setRole("RECLUTADOR");
                Long nitId = empresa.getNitId();
                if (nitId != null) responseDto.setEmpresaId(nitId.intValue());
                return ResponseEntity.ok(responseDto);
            }
        }
    }

    return ResponseEntity.status(401).body(Map.of("error", "Usuario o contraseña incorrectos"));
}
}
