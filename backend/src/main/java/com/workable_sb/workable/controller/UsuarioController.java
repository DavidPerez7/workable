package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.UsuarioDto;
import com.workable_sb.workable.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @PostMapping
    public UsuarioDto crearUsuario(@RequestBody UsuarioDto usuarioDto) {
        return usuarioService.crearUsuario(usuarioDto);
    }

    @GetMapping("/{id}")
    public UsuarioDto obtenerUsuarioPorId(@PathVariable Integer id) {
        return usuarioService.obtenerUsuarioPorId(id);
    }

    @GetMapping
    public List<UsuarioDto> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    @PutMapping("/{id}")
    public UsuarioDto actualizarUsuario(@PathVariable Integer id, @RequestBody UsuarioDto usuarioDto) {
        return usuarioService.actualizarUsuario(id, usuarioDto);
    }

    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Integer id) {
        usuarioService.eliminarUsuario(id);
    }
}
