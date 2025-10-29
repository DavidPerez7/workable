package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.UsrReclutadorDto;
import com.workable_sb.workable.dto.UsrReclutadorReadDto;
import com.workable_sb.workable.service.UsrReclutadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reclutadores")
public class ReclutadorController {
    
    private final UsrReclutadorService reclutadorService;

    public ReclutadorController(UsrReclutadorService reclutadorService) {
        this.reclutadorService = reclutadorService;
    }

    @PostMapping
    public ResponseEntity<?> crearReclutador(@Valid @RequestBody UsrReclutadorDto dto) {
        try {
            UsrReclutadorDto creado = reclutadorService.crear(dto);
            return ResponseEntity.ok(creado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear reclutador: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerReclutadorPorId(@PathVariable Integer id) {
        try {
            UsrReclutadorReadDto reclutador = reclutadorService.buscarPorId(id);
            return ResponseEntity.ok(reclutador);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<UsrReclutadorReadDto>> listarReclutadores() {
        List<UsrReclutadorReadDto> reclutadores = reclutadorService.listarTodos();
        return ResponseEntity.ok(reclutadores);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarReclutador(@PathVariable Integer id, @Valid @RequestBody UsrReclutadorDto dto) {
        try {
            UsrReclutadorDto actualizado = reclutadorService.actualizar(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar reclutador: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarReclutador(@PathVariable Integer id) {
        try {
            reclutadorService.eliminar(id);
            return ResponseEntity.ok().body("Reclutador eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar reclutador: " + e.getMessage());
        }
    }
}
