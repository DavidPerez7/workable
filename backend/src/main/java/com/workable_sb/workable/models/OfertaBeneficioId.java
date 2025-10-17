package com.workable_sb.workable.models;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Data
public class OfertaBeneficioId implements Serializable{
    private Integer oferta_id;
    private Short beneficio_id;
}
