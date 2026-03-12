package com.workable_sb.workable.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "administrador")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Administrador {
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

    @NotBlank(message = "La contraseña es obligatoria")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false, length = 500)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.ADMIN;

    public enum Rol {
        ADMIN
    }

    @PrePersist
    protected void onCreate() {
        if (this.rol == null) {
            this.rol = Rol.ADMIN;
        }
    }
}
