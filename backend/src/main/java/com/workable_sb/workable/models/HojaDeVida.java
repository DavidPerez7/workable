package com.workable_sb.workable.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "hoja_de_vida")
public class HojaDeVida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer hojaDeVidaId;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(nullable = false, length = 1000)
    private String descripcion;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aspirante_id", nullable = false, foreignKey = @ForeignKey(name = "FK_hojaDeVida_aspirante"))
    private Aspirante aspirante;
}
