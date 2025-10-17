package com.workable_sb.workable.models;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.ForeignKey;;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor

public class OfertaBeneficio {

  @EmbeddedId
  private OfertaBeneficioId id = new OfertaBeneficioId();

  @ManyToOne
  @MapsId("oferta_id")
  @JoinColumn(name = "ofertaid", nullable = false, foreignKey = @ForeignKey(name = "FK_ofertaBeneficio_oferta"))
  private Oferta oferta;

  @ManyToOne
  @MapsId("beneficio_id")
  @JoinColumn(name = "beneficioid", nullable = false, foreignKey = @ForeignKey(name = "FK_ofertaBeneficio_beneficio"))
  private Beneficio beneficio;

}
