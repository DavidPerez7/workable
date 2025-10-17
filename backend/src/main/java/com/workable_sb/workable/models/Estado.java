package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table(name = "estado")
public class Estado {
    @Id
    private Short estado_id;

    @Column(nullable = false, length = 50)
    private String nombre;
}
