package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.UsrAspiranteDto;
import com.workable_sb.workable.dto.UsrAspiranteReadDto;
import com.workable_sb.workable.service.UsrAspiranteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/aspirantes")
public class AspiranteController {
    
    private final UsrAspiranteService aspiranteService;

    public AspiranteController(UsrAspiranteService aspiranteService) {
        this.aspiranteService = aspiranteService;
    }

    @PostMapping
    public ResponseEntity<?> crearAspirante(@Valid @RequestBody UsrAspiranteDto dto) {
        try {
            UsrAspiranteDto creado = aspiranteService.crear(dto);
            return ResponseEntity.ok(creado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear aspirante: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerAspirantePorId(@PathVariable Integer id) {
        try {
            UsrAspiranteReadDto aspirante = aspiranteService.buscarPorId(id);
            return ResponseEntity.ok(aspirante);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<UsrAspiranteReadDto>> listarAspirantes() {
        List<UsrAspiranteReadDto> aspirantes = aspiranteService.listarTodos();
        return ResponseEntity.ok(aspirantes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarAspirante(@PathVariable Integer id, @Valid @RequestBody UsrAspiranteDto dto) {
        try {
            UsrAspiranteDto actualizado = aspiranteService.actualizar(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar aspirante: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAspirante(@PathVariable Integer id) {
        try {
            aspiranteService.eliminar(id);
            return ResponseEntity.ok().body("Aspirante eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar aspirante: " + e.getMessage());
        }
    }
}
