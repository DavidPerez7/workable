package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Departamento {
    @Id
    private Integer departamento_id;

    @Column(nullable = false, length = 50)
    private String nombre;
}
