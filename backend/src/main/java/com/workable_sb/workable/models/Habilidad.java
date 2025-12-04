package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.workable_sb.workable.config.TipoHabilidadDeserializer;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Habilidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @JsonDeserialize(using = TipoHabilidadDeserializer.class)
    private TipoHabilidad tipo;

    public enum TipoHabilidad {
        TECNICA,
        IDIOMA,
        BLANDA
    }

    @Column(nullable = false)
    private Boolean isActive = true;
}
