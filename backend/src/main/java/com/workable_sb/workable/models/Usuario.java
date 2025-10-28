package com.workable_sb.workable.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String nombre;

    @Column(nullable = false, length = 255)
    private String correo;
    private Long telefono;

    @Column(nullable = false, length = 255)
    private String clave;

    @Column(nullable = false)
    private String rol;
    private String fotoPerfilUrl;

    @ManyToOne
    @JoinColumn(name = "municipio_id", nullable = false, foreignKey = @ForeignKey(name = "FK_usuario_municipio"))
    private Municipio municipio;
}
