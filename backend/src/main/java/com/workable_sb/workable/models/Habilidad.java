package com.workable_sb.workable.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Modelo de Habilidad - String simple (máx 20 caracteres) de habilidades del aspirante.
 * Asociadas a un aspirante con relación OneToMany inversa en Aspirante.
 */
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name = "habilidad", indexes = {
    @Index(name = "idx_aspirante_id", columnList = "aspirante_id")
})
public class Habilidad {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "La habilidad es obligatoria")
    @Size(min = 2, max = 20, message = "La habilidad debe tener entre 2 y 20 caracteres")
    @Column(nullable = false, length = 20)
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aspirante_id", nullable = false, referencedColumnName = "id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler", "experiencias", "estudios", "habilidades", "postulaciones"})
    private Aspirante aspirante;
}
