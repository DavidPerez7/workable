package com.workable_sb.workable.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.empresa.EmpresaDto;
import com.workable_sb.workable.service.empresa.EmpresaService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/empresa")
public class EmpresaController {
    private final EmpresaService empresaServ;

    public EmpresaController(EmpresaService empresaServ) {
        this.empresaServ = empresaServ;
    }

    @PostMapping
    public ResponseEntity<?> guardar(@Valid @RequestBody EmpresaDto dto) {
        try {
            String correo = SecurityContextHolder.getContext().getAuthentication().getName();
            EmpresaDto empresaGuardada = empresaServ.guardarYVincularReclutador(dto, correo);
            return ResponseEntity.ok(Map.of(
                "mensaje", "Empresa creada y vinculada exitosamente",
                "empresa", empresaGuardada
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al crear empresa: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmpresaDto> listId(@PathVariable Long id) {
        EmpresaDto dto = empresaServ.listId(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<EmpresaDto>> listAllDto() {
        List<EmpresaDto> empresas = empresaServ.listAll();
        return ResponseEntity.ok(empresas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody EmpresaDto dto) {
        try {
            String correo = SecurityContextHolder.getContext().getAuthentication().getName();
            EmpresaDto empresaActualizada = empresaServ.actualizar(id, dto, correo);
            return ResponseEntity.ok(Map.of(
                "mensaje", "Empresa actualizada exitosamente",
                "empresa", empresaActualizada
            ));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al actualizar empresa: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            String correo = SecurityContextHolder.getContext().getAuthentication().getName();
            empresaServ.eliminar(id, correo);
            return ResponseEntity.ok(Map.of("mensaje", "Empresa eliminada exitosamente"));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Error al eliminar empresa: " + e.getMessage()));
        }
    }
}
