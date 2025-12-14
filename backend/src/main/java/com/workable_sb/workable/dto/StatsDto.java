package com.workable_sb.workable.dto;

import java.util.Map;

public class StatsDto {
    private long totalAspirantes;
    private long totalReclutadores;
    private long totalAdministradores;
    private long totalEmpresas;
    private long totalOfertas;
    private long totalPostulaciones;
    private long totalEstudios;
    private long totalExperiencias;
    private long totalHabilidades;
    private long totalNotificaciones;
    private Map<String, Long> byEntity; // optional extensible map

    public long getTotalAspirantes() { return totalAspirantes; }
    public void setTotalAspirantes(long totalAspirantes) { this.totalAspirantes = totalAspirantes; }

    public long getTotalReclutadores() { return totalReclutadores; }
    public void setTotalReclutadores(long totalReclutadores) { this.totalReclutadores = totalReclutadores; }

    public long getTotalAdministradores() { return totalAdministradores; }
    public void setTotalAdministradores(long totalAdministradores) { this.totalAdministradores = totalAdministradores; }

    public long getTotalEmpresas() { return totalEmpresas; }
    public void setTotalEmpresas(long totalEmpresas) { this.totalEmpresas = totalEmpresas; }

    public long getTotalOfertas() { return totalOfertas; }
    public void setTotalOfertas(long totalOfertas) { this.totalOfertas = totalOfertas; }

    public long getTotalPostulaciones() { return totalPostulaciones; }
    public void setTotalPostulaciones(long totalPostulaciones) { this.totalPostulaciones = totalPostulaciones; }

    public long getTotalEstudios() { return totalEstudios; }
    public void setTotalEstudios(long totalEstudios) { this.totalEstudios = totalEstudios; }

    public long getTotalExperiencias() { return totalExperiencias; }
    public void setTotalExperiencias(long totalExperiencias) { this.totalExperiencias = totalExperiencias; }

    public long getTotalHabilidades() { return totalHabilidades; }
    public void setTotalHabilidades(long totalHabilidades) { this.totalHabilidades = totalHabilidades; }

    public long getTotalNotificaciones() { return totalNotificaciones; }
    public void setTotalNotificaciones(long totalNotificaciones) { this.totalNotificaciones = totalNotificaciones; }

    public Map<String, Long> getByEntity() { return byEntity; }
    public void setByEntity(Map<String, Long> byEntity) { this.byEntity = byEntity; }
}
