package com.workable_sb.workable.mapper;

import org.springframework.stereotype.Component;


import com.workable_sb.workable.dto.InfoPersonalDto;
import com.workable_sb.workable.models.Aspirante;
import com.workable_sb.workable.models.Genero;
import com.workable_sb.workable.models.InfoPersonal;
import com.workable_sb.workable.repositories.AspiranteRepository;
import com.workable_sb.workable.repositories.GeneroRepository;
import com.workable_sb.workable.repositories.InfoPersonalRepository;


@Component
public class InfoPersonalMapperImple implements InfoPersonalMapper {


    private final GeneroRepository generoRepository;
    private final AspiranteRepository aspiranteRepository;


    public InfoPersonalMapperImple(GeneroRepository generoRepository, AspiranteRepository aspiranteRepository, InfoPersonalRepository infoPersonalRepository) {
        this.generoRepository = generoRepository;
        this.aspiranteRepository = aspiranteRepository;
    }

    @Override
    public InfoPersonal consult(InfoPersonalDto infoPersonalDto) {
        InfoPersonal infoPersonal = new InfoPersonal();
        infoPersonal.setInfoPersonal_id(infoPersonalDto.getInfPerson_id());
        infoPersonal.setUbicacion(infoPersonalDto.getUbic());
        infoPersonal.setTelefono(infoPersonalDto.getTelef());
        infoPersonal.setFechaNacimiento(infoPersonalDto.getFechnac());
        infoPersonal.setFotoPerfil(infoPersonalDto.getFotperfil());

        Genero genero = generoRepository.findById(infoPersonalDto.getGenero_id()).orElseThrow(() -> new RuntimeException("Genero no encontrado"));
        infoPersonal.setGenero(genero);

        
        Aspirante aspirante = aspiranteRepository.findById(infoPersonalDto.getUsuario_id()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        infoPersonal.setAspirante(aspirante);

        return infoPersonal;

    }

    @Override
    public InfoPersonalDto consultDto(InfoPersonal entity) {
        return new InfoPersonalDto(
            entity.getInfoPersonal_id(),
            entity.getUbicacion(),
            entity.getTelefono(),
            entity.getFechaNacimiento(),
            entity.getFotoPerfil(),
            entity.getGenero().getGenero_id(),
            entity.getGenero().getNombre(),
            entity.getAspirante().getAspiranteId(),
            entity.getAspirante().getNombre());
        }

}
