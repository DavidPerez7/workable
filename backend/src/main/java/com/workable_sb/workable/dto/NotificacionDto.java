package com.workable_sb.workable.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class NotificacionDto {
    private Integer notificacionId;
    private String mensaje;
    private LocalDateTime fecha;
    private Boolean leida;
    private Integer usuarioId;
}
