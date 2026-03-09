package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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

    //atributos obligatorios
    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, length = 255)
    private String nombre;

    @NotNull(message = "El número de trabajadores es obligatorio")
    @Column(nullable = false)
    private Integer numeroTrabajadores;

    @NotBlank(message = "El correo de contacto es obligatorio")
    @Email(message = "El correo debe tener un formato válido")
    @Column(length = 255, nullable = false)
    private String email;

    @NotBlank(message = "El teléfono de contacto es obligatorio")
    @Column(length = 50, nullable = false)
    private String telefono;

    @NotBlank(message = "El NIT es obligatorio")
    @Column(length = 12, unique = true, nullable = false)
    private String nit;

    @NotEmpty(message = "La dirección es obligatoria")
    @ElementCollection(targetClass = Category.class, fetch = FetchType.LAZY)
    @CollectionTable(name = "empresa_category_enum", joinColumns = @JoinColumn(name = "empresa_id", referencedColumnName = "id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "categoria", length = 50, nullable = false)
    private Set<Category> categories = new HashSet<>();

    @NotNull(message = "El municipio es obligatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "municipio_id", nullable = false, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.RESTRICT)
    private Municipio municipio;

    //atributos adicionales
    @Column(length = 255)
    private String descripcion;

    @Column(length = 20, unique = true)
    private String codigoInvitacion;

    @Column(length = 500)
    private String logoUrl;

    private Boolean isActive;

    private float puntuacion = 0.0f;

    private LocalDate fechaCreacion;

    public enum Category {
        TECNOLOGIA,
        SALUD,
        EDUCACION,
        FINANZAS,
        MANUFACTURA,
        COMERCIO,
        CONSTRUCCION,
        SERVICIOS,
        AGRICULTURA,
        OTRO
    }

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null || isActive == null) {
            fechaCreacion = LocalDate.now();
            isActive = true;
        }
        if (codigoInvitacion == null || codigoInvitacion.isEmpty()) {
            generarCodigoInvitacion();
        }
    }

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
