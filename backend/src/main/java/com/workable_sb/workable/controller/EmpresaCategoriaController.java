package com.workable_sb.workable.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.models.EmpresaCategoria;
import com.workable_sb.workable.service.EmpresaCategoriaService;

@RestController
@RequestMapping("/api/empresa-categorias")
public class EmpresaCategoriaController {

    @Autowired
    private EmpresaCategoriaService empresaCategoriaService;

    // CREATE - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody EmpresaCategoria empresaCategoria) {
        try {
            EmpresaCategoria categoriaCreamda = empresaCategoriaService.create(empresaCategoria);
            return ResponseEntity.ok(categoriaCreamda);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear categoría: " + e.getMessage()));
        }
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<EmpresaCategoria> categorias = empresaCategoriaService.getAll();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener categorías: " + e.getMessage()));
        }
    }

    // GET ALL ACTIVAS
    @GetMapping("/activas")
    public ResponseEntity<?> getAllActivas() {
        try {
            List<EmpresaCategoria> categorias = empresaCategoriaService.getAllActivas();
            return ResponseEntity.ok(categorias);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener categorías activas: " + e.getMessage()));
        }
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            Optional<EmpresaCategoria> categoria = empresaCategoriaService.getById(id);
            if (categoria.isPresent()) {
                return ResponseEntity.ok(categoria.get());
            }
            return ResponseEntity.status(404).body(Map.of("error", "Categoría no encontrada"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener categoría: " + e.getMessage()));
        }
    }

    // GET BY NOMBRE
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<?> getByNombre(@PathVariable String nombre) {
        try {
            List<EmpresaCategoria> categorias = empresaCategoriaService.getByNombre(nombre);
            if (!categorias.isEmpty()) {
                return ResponseEntity.ok(categorias);
            }
            return ResponseEntity.status(404).body(Map.of("error", "No se encontraron categorías con ese nombre"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al buscar categorías: " + e.getMessage()));
        }
    }

    // UPDATE - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody EmpresaCategoria empresaCategoria) {
        try {
            EmpresaCategoria categoriaActualizada = empresaCategoriaService.update(id, empresaCategoria);
            if (categoriaActualizada != null) {
                return ResponseEntity.ok(categoriaActualizada);
            }
            return ResponseEntity.status(404).body(Map.of("error", "Categoría no encontrada"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar categoría: " + e.getMessage()));
        }
    }

    // DESACTIVAR - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long id) {
        try {
            EmpresaCategoria categoriaDesactivada = empresaCategoriaService.desactivar(id);
            if (categoriaDesactivada != null) {
                return ResponseEntity.ok(Map.of("message", "Categoría desactivada correctamente", "categoria", categoriaDesactivada));
            }
            return ResponseEntity.status(404).body(Map.of("error", "Categoría no encontrada"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al desactivar categoría: " + e.getMessage()));
        }
    }

    // DELETE - Solo administrador
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            boolean deleted = empresaCategoriaService.delete(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Categoría eliminada correctamente"));
            }
            return ResponseEntity.status(404).body(Map.of("error", "Categoría no encontrada"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar categoría: " + e.getMessage()));
        }
    }
}
