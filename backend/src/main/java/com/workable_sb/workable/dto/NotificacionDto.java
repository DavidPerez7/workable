package com.workable_sb.workable.dto;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class NotificacionDto {
    private Integer notificacionId;
    private String tipo;  // "POSTULACION", "ENTREVISTA", "CAMBIO_ESTADO", "MENSAJE"
    private String titulo;
    private String mensaje;
    private String enlace;  // URL para redirigir
    private LocalDateTime fecha;
    private Boolean leida;
    private Integer usuarioId;
}
