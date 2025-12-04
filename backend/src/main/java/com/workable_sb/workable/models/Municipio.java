package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.workable_sb.workable.config.DepartamentoDeserializer;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Municipio {
    @Id
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @JsonDeserialize(using = DepartamentoDeserializer.class)
    private Departamento departamento;

    public enum Departamento {
        AMAZONAS,
        ANTIOQUIA,
        ARAUCA,
        ATLANTICO,
        BOLIVAR,
        BOYACA,
        CALDAS,
        CAQUETA,
        CASANARE,
        CAUCA,
        CESAR,
        CHOCO,
        CORDOBA,
        CUNDINAMARCA,
        GUAINIA,
        GUAVIARE,
        HUILA,
        LA_GUAJIRA,
        MAGDALENA,
        META,
        NARINO,
        NORTE_DE_SANTANDER,
        PUTUMAYO,
        QUINDIO,
        RISARALDA,
        SAN_ANDRES_Y_PROVIDENCIA,
        SANTANDER,
        SUCRE,
        TOLIMA,
        VALLE_DEL_CAUCA,
        VAUPES,
        VICHADA,
        BOGOTA_DC
    }
}
