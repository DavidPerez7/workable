package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.UsuarioDto;
import com.workable_sb.workable.mapper.UsuarioMapper;
import com.workable_sb.workable.models.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImple implements UsuarioService {
    @Autowired
    private UsuarioMapper usuarioMapper;
    @Autowired
    private com.workable_sb.workable.repository.UsuarioRepository usuarioRepository;

    @Override
    public UsuarioDto crearUsuario(UsuarioDto usuarioDto) {
        Usuario usuario = usuarioMapper.toEntity(usuarioDto);
        Usuario guardado = usuarioRepository.save(usuario);
        return usuarioMapper.toDto(guardado);
    }

    @Override
    public UsuarioDto obtenerUsuarioPorId(Integer id) {
        return usuarioRepository.findById(id)
            .map(usuarioMapper::toDto)
            .orElse(null);
    }

    @Override
    public List<UsuarioDto> listarUsuarios() {
        return usuarioRepository.findAll().stream()
            .map(usuarioMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public UsuarioDto actualizarUsuario(Integer id, UsuarioDto usuarioDto) {
        return usuarioRepository.findById(id)
            .map(usuario -> {
                usuario.setNombre(usuarioDto.getNombre());
                usuario.setCorreo(usuarioDto.getCorreo());
                usuario.setRol(usuarioDto.getRol());
                Usuario actualizado = usuarioRepository.save(usuario);
                return usuarioMapper.toDto(actualizado);
            })
            .orElse(null);
    }

    @Override
    public void eliminarUsuario(Integer id) {
        usuarioRepository.deleteById(id);
    }
}
