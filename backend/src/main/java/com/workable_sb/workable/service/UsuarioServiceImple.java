package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.UsuarioDto;
import com.workable_sb.workable.mapper.UsuarioMapper;
import com.workable_sb.workable.models.User;
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

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public UsuarioDto create(UsuarioDto usuarioDto) {
    User usuario = usuarioMapper.toEntity(usuarioDto);
    usuario.setClave(passwordEncoder.encode(usuario.getClave()));
    User guardado = usuarioRepository.save(usuario);
    return usuarioMapper.toDto(guardado);
    }

    @Override
    public UsuarioDto findById(Integer id) {
        return usuarioRepository.findById(id)
            .map(usuarioMapper::toDto)
            .orElse(null);
    }

    @Override
    public List<UsuarioDto> findAll() {
        return usuarioRepository.findAll().stream()
            .map(usuarioMapper::toDto)
            .collect(Collectors.toList());
    }

    @Override
    public UsuarioDto update(Integer id, UsuarioDto usuarioDto) {
        return usuarioRepository.findById(id)
            .map(usuario -> {
                usuario.setNombre(usuarioDto.getNombre());
                usuario.setCorreo(usuarioDto.getCorreo());
                usuario.setRol(usuarioDto.getRol());
                User actualizado = usuarioRepository.save(usuario);
                return usuarioMapper.toDto(actualizado);
            })
            .orElse(null);
    }

    @Override
    public void delete(Integer id) {
        usuarioRepository.deleteById(id);
    }
}
