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
    //nullable para crear por primera vez sin empresa
    @ManyToOne
    @JoinColumn(name = "empresa_nitId", foreignKey = @ForeignKey(name = "FK_usrReclutador_empresa"))
    private Empresa empresa;
}
