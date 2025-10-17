package com.workable_sb.workable.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table (name = "genero")
public class Genero {
    @Id
    private Short genero_id;
    @Column(nullable = false, length = 50)
    private String nombre;
}
