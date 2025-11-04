package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.EstadoDto;
import com.workable_sb.workable.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private UsuarioService usuarioService;

    // Endpoint para activar/desactivar usuario
    @PatchMapping("/updateEstado/{id}")
    public ResponseEntity<?> cambiarEstadoUsuario(@PathVariable Integer id, @RequestBody EstadoDto estadoDto) {
        boolean actualizado = usuarioService.cambiarEstado(id, estadoDto.getEstado());
        if (!actualizado) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().build();
    }
}
