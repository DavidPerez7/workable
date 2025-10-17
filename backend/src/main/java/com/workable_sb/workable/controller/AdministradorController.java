package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.AdministradorDto;
import com.workable_sb.workable.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/administradores")
public class AdministradorController {
    @Autowired
    private AdministradorService administradorService;

    @PostMapping
    public AdministradorDto crearAdministrador(@RequestBody AdministradorDto administradorDto) {
        return administradorService.crearAdministrador(administradorDto);
    }

    @GetMapping("/{id}")
    public AdministradorDto obtenerAdministradorPorId(@PathVariable Integer id) {
        return administradorService.obtenerAdministradorPorId(id);
    }

    @GetMapping
    public List<AdministradorDto> listarAdministradores() {
        return administradorService.listarAdministradores();
    }

    @PutMapping("/{id}")
    public AdministradorDto actualizarAdministrador(@PathVariable Integer id, @RequestBody AdministradorDto administradorDto) {
        return administradorService.actualizarAdministrador(id, administradorDto);
    }

    @DeleteMapping("/{id}")
    public void eliminarAdministrador(@PathVariable Integer id) {
        administradorService.eliminarAdministrador(id);
    }
}
