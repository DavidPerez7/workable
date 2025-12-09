package com.workable_sb.workable.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.workable_sb.workable.models.Estudio;
import com.workable_sb.workable.models.Experiencia;
import com.workable_sb.workable.models.Aspirante.HabilidadEnum;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidatoDetalleDto {
    
    // Información de la postulación
    private Long postulacionId;
    private LocalDate fechaPostulacion;
    private String estado; // PENDIENTE, RECHAZADO, ACEPTADO, ENTREVISTA_PROGRAMADA

    // Información del usuario (aspirante)
    private Long usuarioId;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private String urlFotoPerfil;
    private String municipio;
    private LocalDate fechaNacimiento;
    private LocalDate fechaRegistro;

    // Información de contacto adicional (de HojaVida si existe)
    private String telefonoAdicional;
    private String linkedin;
    private String portfolio;
    private String github;

    // Información profesional
    private String nivelExperiencia;
    private Long salarioEsperado;
    private String disponibilidad;
    private String idiomas;

    // Datos educativos
    private List<Estudio> estudios;

    // Datos de experiencia laboral
    private List<Experiencia> experiencias;

    // Habilidades
    private Map<HabilidadEnum, String> habilidades;

    // Resumen profesional
    private String resumenProfesional;
    private String objetivoProfesional;
}
