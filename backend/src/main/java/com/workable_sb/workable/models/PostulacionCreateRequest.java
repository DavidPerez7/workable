package com.workable_sb.workable.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PostulacionCreateRequest {
    private Long aspiranteId;
    private Long ofertaId;
}