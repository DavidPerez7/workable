package com.workable_sb.workable.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.service.EmpresaService;

@RestController
@RequestMapping("/api/empresa")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    // - READ all
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping
    public ResponseEntity<List<Empresa>> listarTodas() {
        return ResponseEntity.ok(empresaService.getAll());
    }

    // - READ by isActive
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/activas")
    public ResponseEntity<List<Empresa>> listarActivas(@RequestParam Boolean isActive) {
        return ResponseEntity.ok(empresaService.getByIsActive(isActive));
    }

    // - READ by nombre
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/buscar")
    public ResponseEntity<List<Empresa>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(empresaService.getByNombre(nombre));
    }

    // - READ by nombre path
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<Empresa>> obtenerPorNombre(@PathVariable String nombre) {
        return ResponseEntity.ok(empresaService.getByNombre(nombre));
    }

    // - READ by nit
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/nit/{nit}")
    public ResponseEntity<Empresa> obtenerPorNit(@PathVariable String nit) {
        return empresaService.getByNit(nit)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // - READ by id
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Empresa> obtenerPorId(@PathVariable Long id) {
        return empresaService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // - READ reclutadores
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{empresaId}/reclutadores")
    public ResponseEntity<List<Usuario>> obtenerReclutadores(@PathVariable Long empresaId) {
        return ResponseEntity.ok(empresaService.getReclutadores(empresaId));
    }

    // - CREATE (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Empresa> crear(@RequestBody Empresa empresa, @RequestParam Long usuarioId) {
        return ResponseEntity.ok(empresaService.create(empresa, usuarioId));
    }

    // - CREATE add reclutador (solo owner o ADMIN)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PostMapping("/{empresaId}/reclutadores")
    public ResponseEntity<Empresa> addReclutador(@PathVariable Long empresaId, @RequestBody Usuario nuevoReclutador, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(empresaService.addReclutador(empresaId, nuevoReclutador, usuarioIdActual));
    }

    // - UPDATE (solo owner o ADMIN)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Empresa> actualizar(@PathVariable Long id, @RequestBody Empresa empresa, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(empresaService.update(id, empresa, usuarioIdActual));
    }

    // - DESACTIVAR (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<Empresa> desactivar(@PathVariable Long id) {
        Empresa empresa = empresaService.getById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        empresa.setIsActive(false);
        return ResponseEntity.ok(empresaService.update(id, empresa, null));
    }

    // - ACTIVAR (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/activar")
    public ResponseEntity<Empresa> activar(@PathVariable Long id) {
        Empresa empresa = empresaService.getById(id)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada"));
        empresa.setIsActive(true);
        return ResponseEntity.ok(empresaService.update(id, empresa, null));
    }

    // - DELETE (solo ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        empresaService.delete(id, usuarioIdActual);
        return ResponseEntity.noContent().build();
    }

    // - DELETE remove reclutador (solo owner o ADMIN)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{empresaId}/reclutadores/{reclutadorId}")
    public ResponseEntity<Void> removerReclutador(@PathVariable Long empresaId, @PathVariable Long reclutadorId, @RequestParam Long usuarioIdActual) {
        empresaService.removeReclutador(empresaId, reclutadorId, usuarioIdActual);
        return ResponseEntity.noContent().build();
    }

    // - READ codigo invitacion
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{empresaId}/codigo-invitacion")
    public ResponseEntity<String> getCodigoInvitacion(@PathVariable Long empresaId, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(empresaService.getCodigoInvitacion(empresaId, usuarioIdActual));
    }

    // - UPDATE regenerar codigo invitacion
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PatchMapping("/{empresaId}/regenerar-codigo")
    public ResponseEntity<String> regenerarCodigoInvitacion(@PathVariable Long empresaId, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(empresaService.regenerarCodigoInvitacion(empresaId, usuarioIdActual));
    }

    // - READ validar codigo invitacion
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/validar-codigo")
    public ResponseEntity<Boolean> validarCodigoInvitacion(@RequestParam String nit, @RequestParam String codigo) {
        return ResponseEntity.ok(empresaService.validarCodigoInvitacion(nit, codigo));
    }

    // - CREATE unirse a empresa con codigo
    @PreAuthorize("hasRole('RECLUTADOR')")
    @PostMapping("/unirse-con-codigo")
    public ResponseEntity<Empresa> unirseAEmpresaConCodigo(@RequestParam String nit, @RequestParam String codigoInvitacion, @RequestBody Usuario nuevoReclutador) {
        return ResponseEntity.ok(empresaService.unirseAEmpresaConCodigo(nit, codigoInvitacion, nuevoReclutador));
    }
}
