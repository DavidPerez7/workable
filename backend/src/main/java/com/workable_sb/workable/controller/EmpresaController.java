package com.workable_sb.workable.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    @GetMapping
    public ResponseEntity<List<Empresa>> listarTodas() {
        return ResponseEntity.ok(empresaService.getAll());
    }

    // - READ by isActive
    @GetMapping("/activas")
    public ResponseEntity<List<Empresa>> listarActivas(@RequestParam Boolean isActive) {
        return ResponseEntity.ok(empresaService.getByIsActive(isActive));
    }

    // - READ by nombre
    @GetMapping("/buscar")
    public ResponseEntity<List<Empresa>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(empresaService.getByNombre(nombre));
    }

    // - READ by nombre path
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<Empresa>> obtenerPorNombre(@PathVariable String nombre) {
        return ResponseEntity.ok(empresaService.getByNombre(nombre));
    }

    // - READ by nit
    @GetMapping("/nit/{nit}")
    public ResponseEntity<Empresa> obtenerPorNit(@PathVariable String nit) {
        return empresaService.getByNit(nit)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // - READ by id
    @GetMapping("/{id}")
    public ResponseEntity<Empresa> obtenerPorId(@PathVariable Long id) {
        return empresaService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // - READ reclutadores
    @GetMapping("/{empresaId}/reclutadores")
    public ResponseEntity<List<Usuario>> obtenerReclutadores(@PathVariable Long empresaId) {
        return ResponseEntity.ok(empresaService.getReclutadores(empresaId));
    }

    // - CREATE (solo para ADMIN)
    @PostMapping
    public ResponseEntity<Empresa> crear(@RequestBody Empresa empresa, @RequestParam Long usuarioId) {
        return ResponseEntity.ok(empresaService.create(empresa, usuarioId));
    }

    // - CREATE with owner (moved to AuthController as register-empresa-reclutador)

    // - CREATE add reclutador
    @PostMapping("/{empresaId}/reclutadores")
    public ResponseEntity<Empresa> addReclutador(@PathVariable Long empresaId, @RequestBody Usuario nuevoReclutador, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(empresaService.addReclutador(empresaId, nuevoReclutador, usuarioIdActual));
    }

    // - UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Empresa> actualizar(@PathVariable Long id, @RequestBody Empresa empresa, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(empresaService.update(id, empresa, usuarioIdActual));
    }

    // - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        empresaService.delete(id, usuarioIdActual);
        return ResponseEntity.noContent().build();
    }

    // - DELETE remove reclutador
    @DeleteMapping("/{empresaId}/reclutadores/{reclutadorId}")
    public ResponseEntity<Void> removerReclutador(@PathVariable Long empresaId, @PathVariable Long reclutadorId, @RequestParam Long usuarioIdActual) {
        empresaService.removeReclutador(empresaId, reclutadorId, usuarioIdActual);
        return ResponseEntity.noContent().build();
    }

    // - READ codigo invitacion
    @GetMapping("/{empresaId}/codigo-invitacion")
    public ResponseEntity<String> getCodigoInvitacion(@PathVariable Long empresaId, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(empresaService.getCodigoInvitacion(empresaId, usuarioIdActual));
    }

    // - UPDATE regenerar codigo invitacion
    @PatchMapping("/{empresaId}/regenerar-codigo")
    public ResponseEntity<String> regenerarCodigoInvitacion(@PathVariable Long empresaId, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(empresaService.regenerarCodigoInvitacion(empresaId, usuarioIdActual));
    }

    // - READ validar codigo invitacion
    @GetMapping("/validar-codigo")
    public ResponseEntity<Boolean> validarCodigoInvitacion(@RequestParam String nit, @RequestParam String codigo) {
        return ResponseEntity.ok(empresaService.validarCodigoInvitacion(nit, codigo));
    }

    // - CREATE unirse a empresa con codigo
    @PostMapping("/unirse-con-codigo")
    public ResponseEntity<Empresa> unirseAEmpresaConCodigo(@RequestParam String nit, @RequestParam String codigoInvitacion, @RequestBody Usuario nuevoReclutador) {
        return ResponseEntity.ok(empresaService.unirseAEmpresaConCodigo(nit, codigoInvitacion, nuevoReclutador));
    }
}
