package com.workable_sb.workable.mapper;
import com.workable_sb.workable.repository.UsuarioRepository;

import org.springframework.stereotype.Component;


import com.workable_sb.workable.dto.InfoAspiranteDto;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.models.Genero;
import com.workable_sb.workable.models.InfoAspirante;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.MunicipioRepository;
import com.workable_sb.workable.repository.GeneroRepository;


@Component
public class InfoPersonalMapperImple implements InfoPersonalMapper {

    private final MunicipioRepository municipioRepository;
    private final GeneroRepository generoRepository;
    private final UsuarioRepository usuarioRepository;


    public InfoPersonalMapperImple(GeneroRepository generoRepository, UsuarioRepository usuarioRepository, MunicipioRepository municipioRepository) {
        this.generoRepository = generoRepository;
        this.usuarioRepository = usuarioRepository;
        this.municipioRepository = municipioRepository;
    }

    @Override
    public InfoAspirante toEntity(InfoAspiranteDto infoPersonalDto) {
        InfoAspirante infoPersonal = new InfoAspirante();
        infoPersonal.setId(infoPersonalDto.getId());
        infoPersonal.setTelefono(infoPersonalDto.getTelef());
        infoPersonal.setFechaNacimiento(infoPersonalDto.getFechNac());

        Municipio municipio = municipioRepository.findById(infoPersonalDto.getMunicipio_id()).orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
        infoPersonal.setMunicipio(municipio);

        Genero genero = generoRepository.findById(infoPersonalDto.getGenero_id()).orElseThrow(() -> new RuntimeException("Genero no encontrado"));
        infoPersonal.setGenero(genero);

        Usuario usuario = usuarioRepository.findById(infoPersonalDto.getUsuario_id()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        infoPersonal.setUsuario(usuario);

        return infoPersonal;
    }

    @Override
    public InfoAspiranteDto toDto(InfoAspirante entity) {
        return new InfoAspiranteDto(
            entity.getId(),
            entity.getTelefono(),
            entity.getFechaNacimiento(),
            entity.getMunicipio().getMunicipio_id(),
            entity.getMunicipio().getNombre(),
            entity.getGenero().getGenero_id(),
            entity.getGenero().getNombre(),
            entity.getUsuario().getId(),
            entity.getUsuario().getNombre());
    }

}
