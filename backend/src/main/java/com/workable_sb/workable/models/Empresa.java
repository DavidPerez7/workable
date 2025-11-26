package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
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

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
public class Empresa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String nombre;

    @Column(nullable = false, length = 255)
    private String descripcion;

    @Column(nullable = false)
    private Integer numeroTrabajadores;

    private float puntuacion = 0.0f;

    private LocalDate fechaCreacion;

    // Información de contacto
    @Column(length = 255)
    private String emailContacto;

    @Column(length = 50)
    private String telefonoContacto;

    @Column(length = 255)
    private String website;

    @Column(length = 500)
    private String logoUrl;

    // Identificación legal/fiscal
    @Column(length = 50)
    private String nit;

    @Column(length = 255)
    private String razonSocial;

    // Estado de la empresa
    @Column(nullable = false)
    private Boolean isActive = true;

    @ElementCollection(targetClass = Category.class, fetch = FetchType.LAZY)
    @CollectionTable(name = "empresa_categoria", joinColumns = @JoinColumn(name = "empresa_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "categoria", length = 50)
    private Set<Category> categories = new HashSet<>();
    
    public enum Category {
        TECNOLOGIA,
        SOFTWARE,
        TELECOMUNICACIONES,
        SALUD,
        FARMACEUTICA,
        EDUCACION,
        FINANZAS,
        BANCA,
        SEGUROS,
        CONSULTORIA,
        LEGAL,
        MANUFACTURERA,
        AUTOMOTRIZ,
        CONSTRUCCION,
        INMOBILIARIA,
        ENERGIA,
        RETAIL,
        ECOMMERCE,
        ALIMENTACION,
        TRANSPORTE,
        LOGISTICA,
        MARKETING,
        PUBLICIDAD,
        TURISMO,
        HOTELERIA,
        RESTAURACION,
        RECURSOS_HUMANOS,
        AGRICULTURA,
        MEDIO_AMBIENTE,
        OTRO
    }

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "municipio_id", nullable = false, foreignKey = @ForeignKey(name = "FK_empresa_municipio"))
    private Municipio municipio;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Oferta> ofertas = new ArrayList<>();

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Direccion> direcciones = new ArrayList<>();

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Feedback> feedbacks = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDate.now();
        }
    }
}
