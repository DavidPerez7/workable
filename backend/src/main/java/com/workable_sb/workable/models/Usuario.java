package com.workable_sb.workable.models;

import java.time.LocalDate;

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

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String apellido;

    @Column(nullable = false, unique =  true)
    private String correo;
    private Long telefono;
    private String urlFotoPerfil;
    private LocalDate fechaNacimiento;
    private LocalDate fechaCreacion;
    private Boolean isActive = true;

    @Column(nullable = false, length = 500)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    public enum Rol {
        ASPIRANTE,
        RECLUTADOR,
        ADMIN,
        ADSO
    }

    @ManyToOne
    @JoinColumn(name = "municipio_id", nullable=false, foreignKey = @ForeignKey(name = "FK_usuario_municipio"))
    private Municipio municipio;

    @PrePersist
    protected void onCreate(){
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDate.now();
        }
    }
}