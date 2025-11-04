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
    private String fotoPerfilUrl;

    @Column(nullable = false, length = 255)
    private String clave;

    public enum RolUsr {
        ASPIRANTE,
        RECLUTADOR,
        ADMIN
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolUsr rol;

    @ManyToOne
    @JoinColumn(name = "municipio_id", nullable=false, foreignKey = @ForeignKey(name = "FK_usuario_municipio"))
    private Municipio municipio;

    public enum EstadoUsr {
        ACTIVO,
        INACTIVO
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoUsr estado = EstadoUsr.ACTIVO;
}
