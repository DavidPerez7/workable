package com.workable_sb.workable.models;

import java.sql.Date;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
    private Date fechaNacimiento;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "genero_id", referencedColumnName = "genero_id", foreignKey = @ForeignKey(name = "FK_usrAspirante_Genero"))
    private Genero genero;

    
}
