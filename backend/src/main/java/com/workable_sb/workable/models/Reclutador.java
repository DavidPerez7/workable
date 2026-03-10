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
@Table(name = "reclutador")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Reclutador {    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //atributos obligatorios
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

    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    @Column(length = 20)
    private String telefono;

    @NotNull(message = "La fecha de nacimiento es obligatoria")
    @Past(message = "La fecha de nacimiento debe ser una fecha pasada")
    @Column(nullable = false)
    private LocalDate fechaNacimiento;

    @NotBlank(message = "La contraseña es obligatoria")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 500)
    private String password;

    @NotNull(message = "El rol es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.RECLUTADOR;

    //relaciones
    @NotNull(message = "El municipio es obligatorio")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "municipio_id", nullable = false, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.RESTRICT)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Municipio municipio;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "empresa_id", nullable = true, referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private Empresa empresa;

    private Boolean isActive;

    public enum Rol {
        RECLUTADOR
    }

    @PrePersist
    protected void onCreate() {
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.rol == null) {
            this.rol = Rol.RECLUTADOR;
        }
    }
}
