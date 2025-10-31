package com.workable_sb.workable.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.OfertaDto;
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
    public ResponseEntity<?> guardar(@Valid @RequestBody OfertaDto ofertaDto){
        try {
            String correo = SecurityContextHolder.getContext().getAuthentication().getName();
            OfertaDto guardado = ofertaService.guardarYVincularReclutador(ofertaDto, correo);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"Error al crear oferta: " + e.getMessage() + "\"}");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @Valid @RequestBody OfertaDto ofertaDto) {
        try {
            String correo = SecurityContextHolder.getContext().getAuthentication().getName();
            OfertaDto actualizado = ofertaService.actualizar(id, ofertaDto, correo);
            return ResponseEntity.ok(actualizado);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"Error al actualizar oferta: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfertaDto> ListId(@PathVariable Integer id) {
        OfertaDto ofertaDto = ofertaService.ListId(id);
        return ResponseEntity.ok(ofertaDto);
    }

    @GetMapping
    public ResponseEntity<List<OfertaDto>>listarAll(){
      List<OfertaDto> ofertas = ofertaService.listarAll();
      return ResponseEntity.ok(ofertas);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id){
        try {
            String correo = SecurityContextHolder.getContext().getAuthentication().getName();
            ofertaService.eliminar(id, correo);
            return ResponseEntity.ok("{\"mensaje\": \"Oferta eliminada exitosamente\"}");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("{\"error\": \"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"error\": \"Error al eliminar oferta: " + e.getMessage() + "\"}");
        }
    }
}
