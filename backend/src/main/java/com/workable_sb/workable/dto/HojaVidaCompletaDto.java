package com.workable_sb.workable.dto;

import java.util.List;

import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.HojaVida;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.UsuarioHabilidad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HojaVidaCompletaDto {
    
    // Información de la hoja de vida
    private HojaVida hojaVida;
    
    // Datos del usuario (sin password)
    private UsuarioBasicoDto usuario;
    
    // Estudios del usuario
    private List<Estudio> estudios;
    
    // Experiencias laborales
    private List<Experiencia> experiencias;
    
    // Habilidades del usuario
    private List<UsuarioHabilidad> habilidades;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UsuarioBasicoDto {
        private Long id;
        private String nombre;
        private String apellido;
        private String correo;
        private String telefono;
        private String urlFotoPerfil;
        private String municipio;
        
        public static UsuarioBasicoDto fromUsuario(Usuario usuario) {
            UsuarioBasicoDto dto = new UsuarioBasicoDto();
            dto.setId(usuario.getId());
            dto.setNombre(usuario.getNombre());
            dto.setApellido(usuario.getApellido());
            dto.setCorreo(usuario.getCorreo());
            dto.setTelefono(usuario.getTelefono());
            dto.setUrlFotoPerfil(usuario.getUrlFotoPerfil());
            if (usuario.getMunicipio() != null) {
                dto.setMunicipio(usuario.getMunicipio().getNombre());
            }
            return dto;
        }
    }
}
