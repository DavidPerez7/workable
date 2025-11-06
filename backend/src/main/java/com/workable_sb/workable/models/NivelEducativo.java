package com.workable_sb.workable.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nivel_educativo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NivelEducativo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Estado estado = Estado.ACTIVO;

    public enum Estado {
        ACTIVO,
        INACTIVO
    }
}