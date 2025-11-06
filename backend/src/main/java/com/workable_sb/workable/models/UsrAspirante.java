package com.workable_sb.workable.models;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsrAspirante extends Usuario {

    @Column(length = 50)
    private String apellido;

    @Column(length = 1000)
    private String resumenProfesional;  // Descripción personal para el perfil
    private LocalDate fechaNacimiento;

    public enum GeneroUsr {
        MASCULINO,
        FEMENINO,
        OTRO
    }

    @Enumerated(EnumType.STRING)
    private GeneroUsr genero;

}
