package com.workable_sb.workable.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table(name = "estado")
public class PostulacionEstado {
    @Id
    private Short id;
    private String nombre;
}
