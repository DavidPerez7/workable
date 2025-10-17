package com.workable_sb.workable.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.OfertaDto;
import com.workable_sb.workable.dto.OfertaReadDto;
import com.workable_sb.workable.service.OfertaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/oferta")
public class OfertaController {
    private OfertaService ofertaService;

    public OfertaController(OfertaService ofertaService){
        this.ofertaService = ofertaService;
    }

    @PostMapping
    public ResponseEntity<OfertaReadDto> guardar(@Valid @RequestBody OfertaDto ofertaDto){
        OfertaReadDto guardado = ofertaService.guardar(ofertaDto);
        return ResponseEntity.ok(guardado);
    }
    @GetMapping("/{id}")
    public ResponseEntity<OfertaReadDto> ListId(@PathVariable Integer id) {
    OfertaReadDto ofertaDto = ofertaService.ListId(id);
        return ResponseEntity.ok(ofertaDto);
    }
    @GetMapping
    public ResponseEntity<List<OfertaReadDto>>listarAll(){
      List<OfertaReadDto> ofertas = ofertaService.listarAll();
      return ResponseEntity.ok(ofertas);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id){
      ofertaService.eliminar(id);
      return ResponseEntity.noContent().build();
    }
}
