
package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // - CREATE (PUBLICO: solo aspirantes/reclutadores)
    @PostMapping("/public")
    public ResponseEntity<Usuario> createPublic(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.createPublic(usuario));
    }

    // - CREATE (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Usuario> create(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.create(usuario));
    }

    // - READ all
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN', 'ADSO')")
    @GetMapping
    public ResponseEntity<List<Usuario>> getAll() {
        return ResponseEntity.ok(usuarioService.getAll());
    }

    // - READ by correo
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN', 'ADSO')")
    @GetMapping("/correo")
    public ResponseEntity<Optional<Usuario>> getByCorreo(@RequestParam String correo) {
        return ResponseEntity.ok(usuarioService.getByCorreo(correo));
    }

    // - READ by nombre
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN', 'ADSO')")
    @GetMapping("/nombre")
    public ResponseEntity<Optional<Usuario>> getByNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(usuarioService.getByNombre(nombre));
    }

    // - READ by rol
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN', 'ADSO')")
    @GetMapping("/rol")
    public ResponseEntity<List<Usuario>> getByRol(@RequestParam Usuario.Rol rol) {
        return ResponseEntity.ok(usuarioService.getByRol(rol));
    }

    // - READ by isActive
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN', 'ADSO')")
    @GetMapping("/activos")
    public ResponseEntity<List<Usuario>> getByIsActive(@RequestParam Boolean isActive) {
        return ResponseEntity.ok(usuarioService.getByIsActive(isActive));
    }

    // - READ by municipio
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN', 'ADSO')")
    @GetMapping("/municipio/{municipioId}")
    public ResponseEntity<List<Usuario>> getByMunicipio(@PathVariable Long municipioId) {
        return ResponseEntity.ok(usuarioService.getByMunicipio(municipioId));
    }

    // - READ by id
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR', 'ADMIN', 'ADSO')")
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Usuario>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.getById(id));
    }

    // - UPDATE (PUBLICO: solo aspirantes/reclutadores)
    @PutMapping("/public/{id}")
    public ResponseEntity<Usuario> updatePublic(@PathVariable Long id, @RequestBody Usuario usuario, @RequestParam Long usuarioActualId) {
        return ResponseEntity.ok(usuarioService.updatePublic(id, usuario, usuarioActualId));
    }

    // - UPDATE (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable Long id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.update(id, usuario));
    }

    // - DESACTIVAR (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/desactivar")
    public ResponseEntity<Usuario> desactivar(@PathVariable Long id) {
        Usuario usuario = usuarioService.getById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setIsActive(false);
        return ResponseEntity.ok(usuarioService.update(id, usuario));
    }

    // - ACTIVAR (ADMIN)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/activar")
    public ResponseEntity<Usuario> activar(@PathVariable Long id) {
        Usuario usuario = usuarioService.getById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setIsActive(true);
        return ResponseEntity.ok(usuarioService.update(id, usuario));
    }

    // - DELETE PUBLICO: aspirantes/reclutadores
    @DeleteMapping("/publicDelete/{id}")
    @PreAuthorize("hasAnyRole('ASPIRANTE', 'RECLUTADOR')")
    public ResponseEntity<Void> deletePublic(@PathVariable Long id) {
        usuarioService.deletePublic(id);
        return ResponseEntity.noContent().build();
    }

    // - DELETE (ADMIN SOLAMENTE - reclutadores NO pueden eliminar usuarios)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
