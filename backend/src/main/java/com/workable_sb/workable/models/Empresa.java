package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import jakarta.persistence.Transient;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @Column(nullable = false)
    private List<String> redesSociales = new ArrayList<>();
    
    @Column(nullable = false)
    private List<String> direcciones = new ArrayList<>();

    // Identificación legal/fiscal
    @Column(length = 50, unique = true)
    private String nit;

    @Column(length = 255)
    private String razonSocial;

    // Estado de la empresa
    @Column(nullable = false)
    private Boolean isActive = true;

    // Código de invitación para que otros reclutadores se unan
    @Column(length = 20, unique = true)
    private String codigoInvitacion;

    // Reclutador que creó la empresa (owner/administrador principal)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reclutador_owner_id", referencedColumnName = "id", nullable = true)
    private Reclutador reclutadorOwner;

    @ElementCollection(targetClass = Category.class, fetch = FetchType.LAZY)
    @CollectionTable(name = "empresa_category_enum", joinColumns = @JoinColumn(name = "empresa_id", referencedColumnName = "id"))
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

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "municipio_id", nullable = true, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Municipio municipio;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Oferta> ofertas = new ArrayList<>();

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Feedback> feedbacks = new ArrayList<>();

    // Relación unidireccional: La empresa conoce sus reclutadores
    // Se crea una columna empresa_id en la tabla reclutador
    // IMPORTANTE: Usar @Transient para evitar ConcurrentModificationException durante serialización JSON
    @Transient
    private List<Reclutador> reclutadores = Collections.synchronizedList(new ArrayList<>());

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDate.now();
        }
        // Generar código de invitación si no existe
        if (codigoInvitacion == null || codigoInvitacion.isEmpty()) {
            generarCodigoInvitacion();
        }
    }

    /**
     * Genera un código de invitación único de 12 caracteres
     */
    public void generarCodigoInvitacion() {
        String caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder codigo = new StringBuilder();
        java.util.Random random = new java.util.Random();
        
        for (int i = 0; i < 12; i++) {
            codigo.append(caracteres.charAt(random.nextInt(caracteres.length())));
        }
        
        this.codigoInvitacion = codigo.toString();
    }
}
