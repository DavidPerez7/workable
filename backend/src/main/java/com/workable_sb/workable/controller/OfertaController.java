
package com.workable_sb.workable.controller;

import com.workable_sb.workable.models.Oferta;
import com.workable_sb.workable.models.Postulacion;
import com.workable_sb.workable.models.Postulacion.Estado;
import com.workable_sb.workable.service.OfertaService;
import com.workable_sb.workable.service.PostulacionService;
import com.workable_sb.workable.security.CustomUserDetails;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/oferta")
public class OfertaController {

    @Autowired
    private OfertaService ofertaService;

    @Autowired
    private PostulacionService postulacionService;

    // - CREATE (solo reclutadores de la empresa)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PostMapping
    public ResponseEntity<Oferta> crearOferta(@RequestBody Oferta oferta, @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ofertaService.crearOferta(oferta, oferta.getEmpresa().getId(), user.getUsuarioId()));
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
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
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

    // - UPDATE (solo reclutadores de la empresa)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Oferta> actualizarOferta(@PathVariable Long id, @RequestBody Oferta oferta, @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ofertaService.actualizarOferta(id, oferta, user.getUsuarioId()));
    }

    // - PATCH cambiar estado (solo reclutadores de la empresa)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Oferta> cambiarEstado(@PathVariable Long id, @RequestParam Oferta.EstadoOferta estado, @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(ofertaService.cambiarEstado(id, estado, user.getUsuarioId()));
    }

    // - DELETE (solo reclutadores de la empresa o ADMIN)
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarOferta(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails user) {
        ofertaService.eliminarOferta(id, user.getUsuarioId());
        return ResponseEntity.noContent().build();
    }

    // ============================================
    // RECRUITMENT STAGE - ETAPA DE CONTRATACIÓN
    // ============================================

    // STAGE 1: VER CANDIDATOS POSTULADOS A OFERTA
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{ofertaId}/candidatos")
    public ResponseEntity<List<Postulacion>> obtenerCandidatos(
            @PathVariable Long ofertaId,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.listarPorOferta(ofertaId, user.getUsuarioId()));
    }

    // STAGE 1: FILTRAR CANDIDATOS POR ESTADO
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{ofertaId}/candidatos/estado")
    public ResponseEntity<List<Postulacion>> obtenerCandidatosPorEstado(
            @PathVariable Long ofertaId,
            @RequestParam Estado estado,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.listarPorOfertaYEstado(ofertaId, estado, user.getUsuarioId()));
    }

    // STAGE 2: CAMBIAR ESTADO DEL CANDIDATO
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{ofertaId}/candidatos/{postulacionId}/estado")
    public ResponseEntity<Postulacion> cambiarEstadoCandidato(
            @PathVariable Long ofertaId,
            @PathVariable Long postulacionId,
            @RequestParam Estado nuevoEstado,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.cambiarEstado(postulacionId, nuevoEstado, user.getUsuarioId()));
    }

    // STAGE 3: FILTRAR CANDIDATOS POR EXPERIENCIA Y EDUCACIÓN
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{ofertaId}/candidatos/filtrar")
    public ResponseEntity<List<Postulacion>> filtrarCandidatosPorCriterios(
            @PathVariable Long ofertaId,
            @RequestParam(required = false) String nivelEducativo,
            @RequestParam(required = false) Integer aniosExperienciaMinimo,
            @RequestParam(required = false) String cargoExperiencia,
            @RequestParam(required = false) String municipio,
            @RequestParam(required = false) String habilidad,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.filtrarCandidatosPorCriterios(ofertaId, nivelEducativo, aniosExperienciaMinimo, cargoExperiencia, municipio, habilidad, user.getUsuarioId()));
    }

    // STAGE 4: CLASIFICAR CANDIDATOS POR ETAPA DEL PROCESO
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{ofertaId}/candidatos/etapa")
    public ResponseEntity<?> obtenerCandidatosPorEtapa(
            @PathVariable Long ofertaId,
            @RequestParam Estado etapa,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.obtenerCandidatosPorEtapa(ofertaId, etapa, user.getUsuarioId()));
    }

    // STAGE 4: RESUMEN DE CANDIDATOS POR TODAS LAS ETAPAS
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{ofertaId}/candidatos/resumen-etapas")
    public ResponseEntity<?> obtenerResumenEtapas(
            @PathVariable Long ofertaId,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.obtenerResumenEtapas(ofertaId, user.getUsuarioId()));
    }

    // STAGE 4: ESTADÍSTICAS DE PROGRESIÓN DEL PROCESO
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{ofertaId}/candidatos/estadisticas-proceso")
    public ResponseEntity<?> obtenerEstadisticasProceso(
            @PathVariable Long ofertaId,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.obtenerEstadisticasProceso(ofertaId, user.getUsuarioId()));
    }

    // ============================================
    // CAMBIAR ESTADO - ENDPOINTS ADICIONALES
    // ============================================

    // ENDPOINT 5: Obtener estados disponibles
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{ofertaId}/candidatos/{postulacionId}/estados-disponibles")
    public ResponseEntity<?> obtenerEstadosDisponibles(
            @PathVariable Long ofertaId,
            @PathVariable Long postulacionId,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.obtenerEstadosDisponibles(postulacionId, user.getUsuarioId()));
    }

    // ENDPOINT 6: Historial de cambios
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @GetMapping("/{ofertaId}/candidatos/{postulacionId}/historial-estados")
    public ResponseEntity<?> obtenerHistorialEstados(
            @PathVariable Long ofertaId,
            @PathVariable Long postulacionId,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.obtenerHistorialEstados(postulacionId, user.getUsuarioId()));
    }

    // ENDPOINT 7: Cambio en lote
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PutMapping("/{ofertaId}/candidatos/estado-lote")
    public ResponseEntity<?> cambiarEstadoEnLote(
            @PathVariable Long ofertaId,
            @RequestBody java.util.Map<String, Object> request,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.cambiarEstadoEnLote(ofertaId, request, user.getUsuarioId()));
    }

    // ENDPOINT 8: Validar transición
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PostMapping("/{ofertaId}/candidatos/{postulacionId}/validar-estado")
    public ResponseEntity<?> validarTransicionEstado(
            @PathVariable Long ofertaId,
            @PathVariable Long postulacionId,
            @RequestBody java.util.Map<String, String> request,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.validarTransicionEstado(postulacionId, request, user.getUsuarioId()));
    }

    // ENDPOINT 9: Revertir estado
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    @PatchMapping("/{ofertaId}/candidatos/{postulacionId}/revertir-estado")
    public ResponseEntity<?> revertirEstado(
            @PathVariable Long ofertaId,
            @PathVariable Long postulacionId,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.revertirEstado(postulacionId, user.getUsuarioId()));
    }

    // ENDPOINT 10: Estadísticas de cambios
    @GetMapping("/{ofertaId}/estadisticas-cambios-estado")
    public ResponseEntity<?> obtenerEstadisticasCambiosEstado(
            @PathVariable Long ofertaId,
            @AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(postulacionService.obtenerEstadisticasCambiosEstado(ofertaId, user.getUsuarioId()));
    }
}

