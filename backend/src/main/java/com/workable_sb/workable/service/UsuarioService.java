package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.UsuarioDto;
import java.util.List;

public interface UsuarioService {
    UsuarioDto crearUsuario(UsuarioDto usuarioDto);
    UsuarioDto obtenerUsuarioPorId(Integer id);
    List<UsuarioDto> listarUsuarios();
    UsuarioDto actualizarUsuario(Integer id, UsuarioDto usuarioDto);
    void eliminarUsuario(Integer id);
}
