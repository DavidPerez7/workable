package com.workable_sb.workable.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReclutadorReadDto {
    private Integer id;
    private String nomb;
    private String cla;
    private String corr;
    private Long telef;

    private Long empr_id;
    private String emprNomb;
}
