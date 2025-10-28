package com.workable_sb.workable.models;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.ForeignKey;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UsrReclutador extends Usuario{
    
    @ManyToOne
    @JoinColumn(name = "empresa_nitId", nullable = false, foreignKey = @ForeignKey(name = "FK_dataReclutador_empresa"))
    private Empresa empresa;
}
