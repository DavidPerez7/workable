package com.workable_sb.workable.controller;

import java.util.List;
import java.util.Optional;

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

    // - READ by id
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Empresa>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(empresaService.getById(id));
    }

    // - READ by nit
    @GetMapping("/nit/{nit}")
    public ResponseEntity<Optional<Empresa>> getByNit(@PathVariable String nit) {
        return ResponseEntity.ok(empresaService.getByNit(nit));
    }

    // - READ all
    @GetMapping
    public ResponseEntity<List<Empresa>> getAll() {
        return ResponseEntity.ok(empresaService.getAll());
    }

    // - READ by isActive
    @GetMapping("/activas")
    public ResponseEntity<List<Empresa>> getByIsActive(@RequestParam Boolean isActive) {
        return ResponseEntity.ok(empresaService.getByIsActive(isActive));
    }

    // - READ by nombre
    @GetMapping("/nombre")
    public ResponseEntity<List<Empresa>> getByNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(empresaService.getByNombre(nombre));
    }

    // - READ reclutadores
    @GetMapping("/{empresaId}/reclutadores")
    public ResponseEntity<List<Usuario>> getReclutadores(@PathVariable Long empresaId) {
        return ResponseEntity.ok(empresaService.getReclutadores(empresaId));
    }

    // - CREATE
    @PostMapping
    public ResponseEntity<Empresa> create(@RequestBody Empresa empresa, @RequestParam Long usuarioId) {
        return ResponseEntity.ok(empresaService.create(empresa, usuarioId));
    }

    // - CREATE with owner
    @PostMapping("/with-owner")
    public ResponseEntity<Empresa> createWithOwner(@RequestBody Empresa empresa, @RequestBody Usuario reclutadorOwner) {
        return ResponseEntity.ok(empresaService.createWithOwner(empresa, reclutadorOwner));
    }

    // - CREATE add reclutador
    @PostMapping("/{empresaId}/reclutadores")
    public ResponseEntity<Empresa> addReclutador(@PathVariable Long empresaId, @RequestBody Usuario nuevoReclutador, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(empresaService.addReclutador(empresaId, nuevoReclutador, usuarioIdActual));
    }

    // - UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Empresa> update(@PathVariable Long id, @RequestBody Empresa empresa, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(empresaService.update(id, empresa, usuarioIdActual));
    }

    // - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        empresaService.delete(id, usuarioIdActual);
        return ResponseEntity.noContent().build();
    }

    // - DELETE remove reclutador
    @DeleteMapping("/{empresaId}/reclutadores/{reclutadorId}")
    public ResponseEntity<Void> removeReclutador(@PathVariable Long empresaId, @PathVariable Long reclutadorId, @RequestParam Long usuarioIdActual) {
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
