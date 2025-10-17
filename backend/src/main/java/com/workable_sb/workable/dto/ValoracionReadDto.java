package com.workable_sb.workable.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValoracionReadDto {
    private Integer id;
    private String dec;
    private Float puntu;
    private LocalDate fechaVal;

    private Long empr_id;
    private String emprNomb;

    private Integer asp_id;
    private String aspNomb;
}
