package com.workable_sb.workable.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.ForeignKey;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nitId;

    @Column(nullable = false, length = 255)
    private String nombre;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @Column(nullable = false)
    private Integer numeroTrabajadores;
    private float puntuacion;
    private LocalDate fechaCreacion;

    @ManyToOne(optional  = false)
    @JoinColumn (name = "Empresacategoria_id", nullable = false, foreignKey = @ForeignKey(name = "FK_empresa_empresaCategoria"))
    private EmpresaCategoria empresaCategoria;

    @ManyToOne(optional = false)
    @JoinColumn(name = "municipio_id", nullable = false, foreignKey = @ForeignKey(name = "FK_empresa_municipio"))
    private Municipio municipio;

    @OneToMany(mappedBy = "empresa")
    private java.util.List<Oferta> ofertas;

    @PrePersist
    protected void setFechaCreacion() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDate.now();
        }
    }
}
