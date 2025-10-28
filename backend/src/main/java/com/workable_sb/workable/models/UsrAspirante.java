package com.workable_sb.workable.models;

import java.sql.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false)
    private Date fechaNacimiento;

    @OneToMany(mappedBy = "aspirante")
    private List<Postulacion> postulaciones;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "genero_id", referencedColumnName = "genero_id", foreignKey = @ForeignKey(name = "FK_usrAspirante_Genero"))
    private Genero genero;
}
