
package com.workable_sb.workable.controller.oferta;

import com.workable_sb.workable.dto.oferta.OfertaBeneficioCreateDTO;
import com.workable_sb.workable.models.OfertaBeneficio;
import com.workable_sb.workable.models.OfertaBeneficio.EstadoBeneficio;
import com.workable_sb.workable.service.oferta.OfertaBeneficioService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/oferta-beneficio")
public class OfertaBeneficioController {

    private final OfertaBeneficioService service;

    public OfertaBeneficioController(OfertaBeneficioService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<OfertaBeneficio>> listarBeneficios() {
        return ResponseEntity.ok(service.listarBeneficios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfertaBeneficio> obtenerBeneficio(@PathVariable Short id) {
        return ResponseEntity.ok(service.obtenerBeneficio(id));
    }

    @PostMapping
    public ResponseEntity<OfertaBeneficio> crearBeneficio(@Valid @RequestBody OfertaBeneficioCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(service.crearBeneficio(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfertaBeneficio> actualizarBeneficio(
            @PathVariable Short id,
            @Valid @RequestBody OfertaBeneficioCreateDTO dto) {
        return ResponseEntity.ok(service.actualizarBeneficio(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarBeneficio(@PathVariable Short id) {
        service.eliminarBeneficio(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<OfertaBeneficio> actualizarEstado(
            @PathVariable Short id,
            @RequestParam EstadoBeneficio estado) {
        return ResponseEntity.ok(service.actualizarEstado(id, estado));
    }
}


