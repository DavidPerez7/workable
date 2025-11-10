package com.workable_sb.workable.service.usuario;

import java.util.Objects;

import com.workable_sb.workable.dto.usuario.UsuarioDto;
import com.workable_sb.workable.dto.usuario.UsuarioReadDto;
import com.workable_sb.workable.mapper.usuario.UsuarioMapper;
import com.workable_sb.workable.models.Usuario;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.workable_sb.workable.models.Usuario.EstadoUsr;

@Service
public class UsuarioServiceImple implements UsuarioService {

    private final UsuarioMapper usuarioMapper;
    private final com.workable_sb.workable.repository.UsuarioRepository usuarioRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UsuarioServiceImple(UsuarioMapper usuarioMapper,
                              com.workable_sb.workable.repository.UsuarioRepository usuarioRepository,
                              org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.usuarioMapper = usuarioMapper;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UsuarioDto create(UsuarioDto usuarioDto) {
        Usuario usuario = usuarioMapper.toEntity(usuarioDto);
        usuario.setClave(passwordEncoder.encode(usuario.getClave()));
        Usuario guardado = usuarioRepository.save(usuario);
        return usuarioMapper.toDto(guardado);
    }

    @Override
    public UsuarioReadDto findById(Integer id) {
    Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
    return usuarioRepository.findById(safeId)
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
    Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
    return usuarioRepository.findById(safeId)
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
    Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
    usuarioRepository.deleteById(safeId);
    }

    @Override
    public boolean cambiarEstado(Integer id, EstadoUsr estado) {
    Integer safeId = Objects.requireNonNull(id, "El id no puede ser nulo");
    return usuarioRepository.findById(safeId)
            .map(usuario -> {
                usuario.setEstado(estado);
                usuarioRepository.save(usuario);
                return true;
            }).orElse(false);
    }

    @Override
    public UsuarioReadDto findByNombre(String nombre) {
        String safeNombre = Objects.requireNonNull(nombre, "El nombre no puede ser nulo");
        return usuarioRepository.findByNombre(safeNombre)
            .filter(u -> u.getEstado() == EstadoUsr.ACTIVO)
            .map(usuarioMapper::toReadDto)  // Sin clave
            .orElse(null);
    }
}
