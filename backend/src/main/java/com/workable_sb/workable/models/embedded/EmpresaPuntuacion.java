package com.workable_sb.workable.models.embedded;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.time.LocalDateTime;

@Embeddable
public class EmpresaPuntuacion {

    @Column(name = "aspirante_id", nullable = false)
    private Long aspiranteId;

    @Column(nullable = false)
    private float puntuacion;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    // Constructor vacío
    public EmpresaPuntuacion() {}

    // Constructor con parámetros
    public EmpresaPuntuacion(Long aspiranteId, float puntuacion, LocalDateTime fechaCreacion) {
        this.aspiranteId = aspiranteId;
        this.puntuacion = puntuacion;
        this.fechaCreacion = fechaCreacion;
    }

    // Getters y Setters
    public Long getAspiranteId() {
        return aspiranteId;
    }

    public void setAspiranteId(Long aspiranteId) {
        this.aspiranteId = aspiranteId;
    }

    public float getPuntuacion() {
        return puntuacion;
    }

    public void setPuntuacion(float puntuacion) {
        this.puntuacion = puntuacion;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}