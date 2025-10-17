package com.workable_sb.workable.service;

import com.workable_sb.workable.dto.AdministradorDto;
import java.util.List;

public interface AdministradorService {
    AdministradorDto crearAdministrador(AdministradorDto administradorDto);
    AdministradorDto obtenerAdministradorPorId(Integer id);
    List<AdministradorDto> listarAdministradores();
    AdministradorDto actualizarAdministrador(Integer id, AdministradorDto administradorDto);
    void eliminarAdministrador(Integer id);
}
