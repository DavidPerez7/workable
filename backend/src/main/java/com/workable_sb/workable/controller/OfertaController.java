
package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.service.OfertaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/oferta")
public class OfertaController {

    @Autowired
    private OfertaService ofertaService;

    // - CREATE
    @PostMapping
    public ResponseEntity<Oferta> crearOferta(@RequestBody Oferta oferta, @RequestParam Long empresaId, @RequestParam Long reclutadorId) {
        return ResponseEntity.ok(ofertaService.crearOferta(oferta, empresaId, reclutadorId));
    }

    // - READ by id
    @GetMapping("/{id}")
    public ResponseEntity<Oferta> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ofertaService.obtenerPorId(id));
    }

    // - READ all
    @GetMapping
    public ResponseEntity<List<Oferta>> listarTodas() {
        return ResponseEntity.ok(ofertaService.listarTodas());
    }

    // - READ by empresa
    @GetMapping("/empresa/{empresaId}")
    public ResponseEntity<List<Oferta>> listarPorEmpresa(@PathVariable Long empresaId) {
        return ResponseEntity.ok(ofertaService.listarPorEmpresa(empresaId));
    }

    // - READ by estado
    @GetMapping("/estado")
    public ResponseEntity<List<Oferta>> listarPorEstado(@RequestParam Oferta.EstadoOferta estado) {
        return ResponseEntity.ok(ofertaService.listarPorEstado(estado));
    }

    // - READ abiertas
    @GetMapping("/abiertas")
    public ResponseEntity<List<Oferta>> listarAbiertas() {
        return ResponseEntity.ok(ofertaService.listarAbiertas());
    }

    // - READ by reclutador
    @GetMapping("/reclutador/{reclutadorId}")
    public ResponseEntity<List<Oferta>> listarPorReclutador(@PathVariable Long reclutadorId) {
        return ResponseEntity.ok(ofertaService.listarPorReclutador(reclutadorId));
    }

    // - READ by municipio
    @GetMapping("/municipio/{municipioId}")
    public ResponseEntity<List<Oferta>> listarPorMunicipio(@PathVariable Long municipioId) {
        return ResponseEntity.ok(ofertaService.listarPorMunicipio(municipioId));
    }

    // - READ by modalidad
    @GetMapping("/modalidad")
    public ResponseEntity<List<Oferta>> listarPorModalidad(@RequestParam Oferta.Modalidad modalidad) {
        return ResponseEntity.ok(ofertaService.listarPorModalidad(modalidad));
    }

    // - READ buscar por texto
    @GetMapping("/buscar")
    public ResponseEntity<List<Oferta>> buscarPorTexto(@RequestParam String texto) {
        return ResponseEntity.ok(ofertaService.buscarPorTexto(texto));
    }

    // - UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Oferta> actualizarOferta(@PathVariable Long id, @RequestBody Oferta oferta, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(ofertaService.actualizarOferta(id, oferta, usuarioIdActual));
    }

    // - PATCH cambiar estado
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Oferta> cambiarEstado(@PathVariable Long id, @RequestParam Oferta.EstadoOferta estado, @RequestParam Long usuarioIdActual) {
        return ResponseEntity.ok(ofertaService.cambiarEstado(id, estado, usuarioIdActual));
    }

    // - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarOferta(@PathVariable Long id, @RequestParam Long usuarioIdActual) {
        ofertaService.eliminarOferta(id, usuarioIdActual);
        return ResponseEntity.noContent().build();
    }
}
