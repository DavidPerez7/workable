package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.UsrAspiranteDto;
import com.workable_sb.workable.dto.UsrAspiranteReadDto;
import com.workable_sb.workable.repository.UsrAspiranteRepository;
import com.workable_sb.workable.service.UsrAspiranteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/aspirante")
public class UsrAspiranteController {
    
    private final UsrAspiranteService aspiranteServ;
    private final UsrAspiranteRepository aspiranteRepo;

    public UsrAspiranteController(UsrAspiranteService aspiranteServ, UsrAspiranteRepository aspiranteRepo) {
        this.aspiranteServ = aspiranteServ;
        this.aspiranteRepo = aspiranteRepo;
    }

    @PostMapping
    public ResponseEntity<?> createAspirante(@Valid @RequestBody UsrAspiranteDto dto) {
        if (aspiranteRepo.findByCorreo(dto.getCorreo()).isPresent()) {
            return ResponseEntity.badRequest().body("Error al crear aspirante: El correo ya está en uso.");
        }
        UsrAspiranteDto creado = aspiranteServ.crear(dto);
        UsrAspiranteReadDto guardado = aspiranteServ.buscarPorId(creado.getId());
        return ResponseEntity.ok(guardado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerAspirantePorId(@PathVariable Integer id) {
        try {
            UsrAspiranteReadDto aspirante = aspiranteServ.buscarPorId(id);
            return ResponseEntity.ok(aspirante);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<UsrAspiranteReadDto>> listarAspirantes() {
        List<UsrAspiranteReadDto> aspirantes = aspiranteServ.listarTodos();
        return ResponseEntity.ok(aspirantes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarAspirante(@PathVariable Integer id, @Valid @RequestBody UsrAspiranteDto dto) {
        try {
            UsrAspiranteDto actualizado = aspiranteServ.actualizar(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar aspirante: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAspirante(@PathVariable Integer id) {
        try {
            aspiranteServ.eliminar(id);
            return ResponseEntity.ok().body("Aspirante eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar aspirante: " + e.getMessage());
        }
    }
}
