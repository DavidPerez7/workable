
package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    @PostMapping
    public ResponseEntity<Usuario> create(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.create(usuario));
    }

    // - READ by id
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Usuario>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.getById(id));
    }

    // - READ by correo
    @GetMapping("/correo")
    public ResponseEntity<Optional<Usuario>> getByCorreo(@RequestParam String correo) {
        return ResponseEntity.ok(usuarioService.getByCorreo(correo));
    }

    // - READ by nombre
    @GetMapping("/nombre")
    public ResponseEntity<Optional<Usuario>> getByNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(usuarioService.getByNombre(nombre));
    }

    // - READ by rol
    @GetMapping("/rol")
    public ResponseEntity<List<Usuario>> getByRol(@RequestParam Usuario.Rol rol) {
        return ResponseEntity.ok(usuarioService.getByRol(rol));
    }

    // - READ by isActive
    @GetMapping("/activos")
    public ResponseEntity<List<Usuario>> getByIsActive(@RequestParam Boolean isActive) {
        return ResponseEntity.ok(usuarioService.getByIsActive(isActive));
    }

    // - READ by municipio
    @GetMapping("/municipio/{municipioId}")
    public ResponseEntity<List<Usuario>> getByMunicipio(@PathVariable Long municipioId) {
        return ResponseEntity.ok(usuarioService.getByMunicipio(municipioId));
    }

    // - UPDATE (PUBLICO: solo aspirantes/reclutadores)
    @PutMapping("/public/{id}")
    public ResponseEntity<Usuario> updatePublic(@PathVariable Long id, @RequestBody Usuario usuario, @RequestParam Long usuarioActualId) {
        return ResponseEntity.ok(usuarioService.updatePublic(id, usuario, usuarioActualId));
    }

    // - UPDATE (ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable Long id, @RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.update(id, usuario));
    }

    // - DELETE (PUBLICO: solo aspirantes/reclutadores)
    @DeleteMapping("/public/{id}")
    public ResponseEntity<Void> deletePublic(@PathVariable Long id, @RequestParam Long usuarioActualId) {
        usuarioService.deletePublic(id, usuarioActualId);
        return ResponseEntity.noContent().build();
    }

    // - DELETE (ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
