package com.workable_sb.workable.models;

import java.sql.Date;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class Estudio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer estudio_id;

    @Column(nullable = false, length = 255)
    private String nombre;

    @Column(nullable = false)
    private Date fechaInicio;

    private Date fechaFin;

    @Column(nullable = false)
    private String institucion;

    @Column(nullable = false)
    private String certificado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn (name = "nivelEducativo_id", nullable = false, foreignKey = @ForeignKey(name = "FK_datosEstudios_nivelEducativo"))
    private NivelEducativo nivelEducativo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn (name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "FK_datoEstudio_usuario"))
    private Usuario usuario;
}