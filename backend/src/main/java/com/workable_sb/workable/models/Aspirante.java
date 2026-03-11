package com.workable_sb.workable.models;

import java.time.LocalDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "aspirante")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Aspirante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //atributos de registro obligatorios
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 25, message = "El nombre debe tener entre 3 y 25 caracteres")
    @Column(nullable = false, length = 25)
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 3, max = 25, message = "El apellido debe tener entre 3 y 25 caracteres")
    @Column(nullable = false, length = 25)
    private String apellido;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe tener un formato válido") // validar @ y dominio
    @Column(nullable = false, unique = true, length = 255)
    private String correo;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser una fecha pasada")
    @Column(nullable = false)
    private LocalDate fechaNacimiento;

    @NotBlank(message = "La contraseña es obligatoria")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 500)
    private String password;

    @NotNull(message = "El municipio es obligatorio")
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "municipio_id", nullable = true, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Municipio municipio;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "El género es obligatorio")
    @Column(nullable = false, length = 20)
    private Genero genero;

    @NotNull(message = "El rol es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.ASPIRANTE;

    //atributos adicionales
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    @Column(length = 20)
    private String telefono;

    @Size(max = 500, message = "La URL de la foto no puede exceder 500 caracteres")
    @Column(length = 500)
    private String urlFotoPerfil;

    @Size(max = 200, message = "La ubicación no puede exceder 200 caracteres")
    @Column(length = 200)
    private String ubicacion;
    
    private LocalDate fechaCreacion;
    
    private Boolean isActive;

    public enum Rol {
        ASPIRANTE
    }

    public enum Genero {
        MASCULINO, FEMENINO, OTRO
    }

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
    }
}
