package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.usuario.UsuarioDto;
import com.workable_sb.workable.dto.usuario.UsuarioReadDto;
import com.workable_sb.workable.service.usuario.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    private final UsuarioService usuarioServ;

    public UsuarioController(UsuarioService usuarioServ) {
        this.usuarioServ = usuarioServ;
    }

    // este pedira el Dtype para creacion de usuarios en general
    @PostMapping
    public ResponseEntity<?> createUsuario(@RequestBody UsuarioDto usuarioDto) {
        try {
            UsuarioDto creado = usuarioServ.create(usuarioDto);
            return ResponseEntity.ok(creado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear usuario: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Integer id) {
        UsuarioReadDto usuario = usuarioServ.findById(id);  // Sin clave
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioReadDto>> listarUsuarios() {
        List<UsuarioReadDto> usuarios = usuarioServ.findAll();  // Sin clave
        return ResponseEntity.ok(usuarios);
    }

@PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Integer id, @RequestBody UsuarioDto usuarioDto) {
        UsuarioReadDto actualizado = usuarioServ.update(id, usuarioDto);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Integer id) {
        try {
            usuarioServ.delete(id);
            return ResponseEntity.ok().body("Usuario eliminado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar usuario: " + e.getMessage());
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorNombre(@RequestParam String nombre) {
        UsuarioReadDto usuario = usuarioServ.findByNombre(nombre);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }
}
