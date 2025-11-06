package com.workable_sb.workable.dto.notificacion;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificacionDto {
    private Integer id;
    
    @NotBlank(message = "El tipo es obligatorio")
    private String tipo;  // "POSTULACION", "ENTREVISTA", "CAMBIO_ESTADO", "MENSAJE"
    
    @NotBlank(message = "El título es obligatorio")
    private String titulo;
    
    @NotBlank(message = "El mensaje es obligatorio")
    private String mensaje;
    
    private String enlace;  // URL para redirigir
    private LocalDateTime fecha;
    private Boolean leida;
    
    @NotNull(message = "El usuario es obligatorio")
    private Integer usuarioId;
}
