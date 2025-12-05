package com.workable_sb.workable.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.workable_sb.workable.config.TipoHabilidadDeserializer;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "habilidad")
public class Habilidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre de la habilidad es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @NotNull(message = "El tipo de habilidad es obligatorio")
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
