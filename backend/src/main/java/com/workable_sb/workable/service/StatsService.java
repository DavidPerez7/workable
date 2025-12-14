package com.workable_sb.workable.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workable_sb.workable.dto.StatsDto;
import com.workable_sb.workable.repository.*;

import java.util.HashMap;
import org.springframework.beans.factory.annotation.Autowired;
import com.workable_sb.workable.service.LogService;

@Service
public class StatsService {

    @Autowired private AspiranteRepo aspiranteRepo;
    @Autowired private ReclutadorRepo reclutadorRepo;
    @Autowired private AdministradorRepo administradorRepo;
    @Autowired private EmpresaRepo empresaRepo;
    @Autowired private OfertaRepo ofertaRepo;
    @Autowired private PostulacionRepo postulacionRepo;
    @Autowired private EstudioRepo estudioRepo;
    @Autowired private ExperienciaRepo experienciaRepo;
    @Autowired private HabilidadRepo habilidadRepo;
    @Autowired private NotificacionRepo notificacionRepo;
    @Autowired private LogService logService;

    public StatsDto collect() {
        StatsDto dto = new StatsDto();
        // collect counts with per-repo error handling so a single DB issue doesn't cause a global 500
        dto.setTotalAspirantes(safeCount(() -> aspiranteRepo.count(), "aspirante.count"));
        dto.setTotalReclutadores(safeCount(() -> reclutadorRepo.count(), "reclutador.count"));
        dto.setTotalAdministradores(safeCount(() -> administradorRepo.count(), "administrador.count"));
        dto.setTotalEmpresas(safeCount(() -> empresaRepo.count(), "empresa.count"));
        dto.setTotalOfertas(safeCount(() -> ofertaRepo.count(), "oferta.count"));
        dto.setTotalPostulaciones(safeCount(() -> postulacionRepo.count(), "postulacion.count"));
        dto.setTotalEstudios(safeCount(() -> estudioRepo.count(), "estudio.count"));
        dto.setTotalExperiencias(safeCount(() -> experienciaRepo.count(), "experiencia.count"));
        dto.setTotalHabilidades(safeCount(() -> habilidadRepo.count(), "habilidad.count"));
        dto.setTotalNotificaciones(safeCount(() -> notificacionRepo.count(), "notificacion.count"));

        var byEntity = new HashMap<String, Long>();
        byEntity.put("aspirantes", dto.getTotalAspirantes());
        byEntity.put("reclutadores", dto.getTotalReclutadores());
        byEntity.put("administradores", dto.getTotalAdministradores());
        byEntity.put("empresas", dto.getTotalEmpresas());
        byEntity.put("ofertas", dto.getTotalOfertas());
        byEntity.put("postulaciones", dto.getTotalPostulaciones());
        dto.setByEntity(byEntity);

        return dto;
    }

    private interface CountSupplier { long get() throws Exception; }

    private long safeCount(CountSupplier supplier, String key) {
        try {
            return supplier.get();
        } catch (Exception ex) {
            String msg = "Error fetching count for " + key + ": " + ex.getMessage();
            logService.add("ERROR", "BACKEND", msg, ex.toString());
            return 0L;
        }
    }
}
