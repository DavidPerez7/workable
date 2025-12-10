package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.service.MunicipioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/municipio")
public class MunicipioController {

    @Autowired
    private MunicipioService municipioService;

    // ===== READ =====
    @GetMapping
    public ResponseEntity<List<Municipio>> obtenerTodos() {
        try {
            List<Municipio> municipios = municipioService.obtenerTodos();
            return ResponseEntity.ok(municipios);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/departamento/{departamento}")
    public ResponseEntity<List<Municipio>> obtenerPorDepartamento(@PathVariable Municipio.Departamento departamento) {
        try {
            List<Municipio> municipios = municipioService.obtenerPorDepartamento(departamento);
            return ResponseEntity.ok(municipios);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Municipio>> buscarPorNombre(@RequestParam String nombre) {
        try {
            List<Municipio> municipios = municipioService.buscarPorNombre(nombre);
            return ResponseEntity.ok(municipios);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            Municipio municipio = municipioService.obtenerPorId(id);
            return ResponseEntity.ok(municipio);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener municipio: " + e.getMessage()));
        }
    }
}