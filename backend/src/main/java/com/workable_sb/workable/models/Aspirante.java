package com.workable_sb.workable.models;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Entity
@Table(name = "aspirante")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Aspirante {
    
    private static final Logger log = LoggerFactory.getLogger(Aspirante.class);
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @Column(nullable = false, length = 50)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    @Column(nullable = false, length = 50)
    private String apellido;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe tener un formato válido")
    @Column(nullable = false, unique = true, length = 255)
    private String correo;

    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    @Column(length = 20)
    private String telefono;

    @Size(max = 500, message = "La URL de la foto no puede exceder 500 caracteres")
    @Column(length = 500)
    private String urlFotoPerfil;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser una fecha pasada")
    @Column(nullable = false)
    private LocalDate fechaNacimiento;
    
    private LocalDate fechaCreacion;
    
    private Boolean isActive;

    @NotBlank(message = "La contraseña es obligatoria")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 500)
    private String password;

    @NotNull(message = "El rol es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.ASPIRANTE;

    public enum Rol {
        ASPIRANTE
    }

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "municipio_id", nullable = true, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Municipio municipio;

    // Campos específicos de Aspirante
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    @Column(length = 1000)
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Genero genero;

    public enum Genero {
        MASCULINO, FEMENINO, OTRO
    }

    @Size(max = 200, message = "La ubicación no puede exceder 200 caracteres")
    @Column(length = 200)
    private String ubicacion;

    // Relaciones
    @OneToMany(mappedBy = "aspirante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("aspirante")
    private List<Estudio> estudios;

    @OneToMany(mappedBy = "aspirante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("aspirante")
    private List<Experiencia> experiencias;

    @OneToMany(mappedBy = "aspirante", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("aspirante")
    private List<UsuarioHabilidad> habilidades;

    @PrePersist
    protected void onCreate() {
        if (this.fechaCreacion == null) {
            this.fechaCreacion = LocalDate.now();
        }
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.rol == null) {
            this.rol = Rol.ASPIRANTE;
        }
        log.info("Aspirante creado: {} {} con rol {}", this.nombre, this.apellido, this.rol);
    }
    
    @PreUpdate
    protected void onUpdate() {
        log.info("Aspirante actualizado: {} (ID: {})", this.correo, this.id);
    }
}
