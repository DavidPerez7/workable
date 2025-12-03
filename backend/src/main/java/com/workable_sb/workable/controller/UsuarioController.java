package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.usuario.UsuarioDto;
import com.workable_sb.workable.dto.usuario.UsuarioReadDto;
import com.workable_sb.workable.service.UsuarioService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // CREATE
    @PostMapping
    public ResponseEntity<UsuarioDto> create(@Valid @RequestBody UsuarioDto usuarioDto) {
        return ResponseEntity.ok(usuarioService.create(usuarioDto));
    }

    // READ by id
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioReadDto> getById(@PathVariable Integer id) {
        UsuarioReadDto usuario = usuarioService.findById(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    // READ all
    @GetMapping
    public ResponseEntity<List<UsuarioReadDto>> getAll() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioReadDto> update(@PathVariable Integer id, @Valid @RequestBody UsuarioDto usuarioDto) {
        UsuarioReadDto actualizado = usuarioService.update(id, usuarioDto);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizado);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        usuarioService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // READ by nombre
    @GetMapping("/buscar")
    public ResponseEntity<UsuarioReadDto> getByNombre(@RequestParam String nombre) {
        UsuarioReadDto usuario = usuarioService.findByNombre(nombre);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }
}
