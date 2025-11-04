package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.UsrReclutadorDto;
import com.workable_sb.workable.dto.UsrReclutadorReadDto;
import com.workable_sb.workable.service.UsrReclutadorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reclutador")
public class UsrReclutadorController {
    
    private final UsrReclutadorService reclutadorService;

    public UsrReclutadorController(UsrReclutadorService reclutadorService) {
        this.reclutadorService = reclutadorService;
    }

    @PostMapping
    public ResponseEntity<?> crearReclutador(@Valid @RequestBody UsrReclutadorDto dto) {
        try {
            UsrReclutadorDto creado = reclutadorService.crear(dto);
            UsrReclutadorReadDto guardado = reclutadorService.buscarPorId(creado.getId());
            return ResponseEntity.ok(guardado);
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

    //para admin
    @GetMapping
    public ResponseEntity<List<UsrReclutadorReadDto>> listarReclutadores() {
        List<UsrReclutadorReadDto> reclutadores = reclutadorService.listarTodos();
        return ResponseEntity.ok(reclutadores);
    }

    //para reclutador ver sus compañeros
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<UsrReclutadorReadDto>> listarReclutadoresPorEmpresa(@PathVariable Long empresaId) {
        List<UsrReclutadorReadDto> reclutadores = reclutadorService.listarPorEmpresa(empresaId);
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
