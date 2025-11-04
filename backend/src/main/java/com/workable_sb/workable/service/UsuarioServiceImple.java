package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.UsuarioDto;
import com.workable_sb.workable.dto.UsuarioReadDto;
import com.workable_sb.workable.mapper.UsuarioMapper;
import com.workable_sb.workable.models.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.workable_sb.workable.models.Usuario.EstadoUsr;

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
        Usuario usuario = usuarioMapper.toEntity(usuarioDto);
        usuario.setClave(passwordEncoder.encode(usuario.getClave()));
        Usuario guardado = usuarioRepository.save(usuario);
        return usuarioMapper.toDto(guardado);
    }

    @Override
    public UsuarioReadDto findById(Integer id) {
        return usuarioRepository.findById(id)
            .filter(u -> u.getEstado() == EstadoUsr.ACTIVO)
            .map(usuarioMapper::toReadDto)  // Sin clave
            .orElse(null);
    }

    @Override
    public List<UsuarioReadDto> findAll() {
        return usuarioRepository.findAll().stream()
            .filter(u -> u.getEstado() == EstadoUsr.ACTIVO)
            .map(usuarioMapper::toReadDto)  // Sin clave
            .collect(Collectors.toList());
    }

    @Override
    public UsuarioDto update(Integer id, UsuarioDto usuarioDto) {
        return usuarioRepository.findById(id)
            .filter(u -> u.getEstado() == EstadoUsr.ACTIVO)
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
    public void delete(Integer id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public boolean cambiarEstado(Integer id, EstadoUsr estado) {
        return usuarioRepository.findById(id)
            .map(usuario -> {
                usuario.setEstado(estado);
                usuarioRepository.save(usuario);
                return true;
            }).orElse(false);
    }
}
