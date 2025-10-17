package com.workable_sb.workable.controller;

import com.workable_sb.workable.dto.HojaDeVidaDto;
import com.workable_sb.workable.service.HojaDeVidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hojasdevida")
public class HojaDeVidaController {
    @Autowired
    private HojaDeVidaService hojaDeVidaService;

    @PostMapping
    public HojaDeVidaDto crearHojaDeVida(@RequestBody HojaDeVidaDto hojaDeVidaDto) {
        return hojaDeVidaService.crearHojaDeVida(hojaDeVidaDto);
    }

    @GetMapping("/{id}")
    public HojaDeVidaDto obtenerHojaDeVidaPorId(@PathVariable Integer id) {
        return hojaDeVidaService.obtenerHojaDeVidaPorId(id);
    }

    @GetMapping("/aspirante/{aspiranteId}")
    public List<HojaDeVidaDto> listarHojasDeVidaPorAspirante(@PathVariable Integer aspiranteId) {
        return hojaDeVidaService.listarHojasDeVidaPorAspirante(aspiranteId);
    }

    @PutMapping("/{id}")
    public HojaDeVidaDto actualizarHojaDeVida(@PathVariable Integer id, @RequestBody HojaDeVidaDto hojaDeVidaDto) {
        return hojaDeVidaService.actualizarHojaDeVida(id, hojaDeVidaDto);
    }

    @DeleteMapping("/{id}")
    public void eliminarHojaDeVida(@PathVariable Integer id) {
        hojaDeVidaService.eliminarHojaDeVida(id);
    }
}
