package com.workable_sb.workable.models;

import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Genero {
    @Id
    private Short genero_id;
    private String nombre;
}
