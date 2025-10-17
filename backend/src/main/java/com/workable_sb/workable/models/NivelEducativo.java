package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "nivel_educativo")
public class NivelEducativo {
    @Id
    private Integer nivelEducativo_id;

    @Column(nullable = false, length = 255)
    private String nombre;
}
