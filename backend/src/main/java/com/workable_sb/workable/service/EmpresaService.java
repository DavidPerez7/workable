package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.exception.ResourceNotFoundException;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Reclutador;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.ReclutadorRepo;

@Service
@Transactional
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private ReclutadorRepo usuarioRepository;

    @Autowired
    private MunicipioRepo municipioRepo;

    // ===== READ =====
    public Optional<Empresa> getById(Long id) {
        return empresaRepository.findById(id);
    }

    public Optional<Empresa> getByNit(String nit) {
        return empresaRepository.findByNit(nit);
    }

    public List<Empresa> getAll() {
        return empresaRepository.findAll();
    }

    public List<Empresa> getByIsActive(Boolean isActive) {
        return empresaRepository.findByIsActive(isActive);
    }

    public List<Empresa> getByNombre(String nombre) {
        return empresaRepository.findByNombreContainingIgnoreCase(nombre);
    }

    // READ (para reclutadores de la empresa)
    public List<Reclutador> getReclutadores(Long empresaId) {
        Empresa empresa = empresaRepository.findById(empresaId).orElseThrow(() -> new RuntimeException("Empresa not found"));
        return empresa.getReclutadores();
    }

    // ===== CREATE =====
    public Empresa create(Empresa request, Long usuarioId) {

        // Validar usuario autenticado
        Reclutador usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Reclutador", "id", usuarioId));

        if (empresaRepository.existsByNit(request.getNit())) {
            throw new IllegalArgumentException("El NIT ya está en uso");
        }

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Municipio", "id", request.getMunicipio().getId()));
            request.setMunicipio(municipio);
        }

        // Definir owner y agregar a reclutadores
        request.setReclutadorOwner(usuario);
        request.getReclutadores().add(usuario);

        return empresaRepository.save(request);
    }

    public Empresa createWithOwner(Empresa empresa, Reclutador reclutadorOwner) {

        if (empresaRepository.existsByNit(empresa.getNit())) {
            throw new IllegalArgumentException("El NIT ya está en uso");
        }

        if (usuarioRepository.findByCorreo(reclutadorOwner.getCorreo()).isPresent()) {
            throw new IllegalArgumentException("El correo ya está en uso");
        }

        Reclutador ownerGuardado = usuarioRepository.save(reclutadorOwner);

        empresa.setReclutadorOwner(ownerGuardado);
        empresa.getReclutadores().add(ownerGuardado);

        return empresaRepository.save(empresa);
    }

    public Empresa addReclutador(Long empresaId, Reclutador nuevoReclutador, Long usuarioIdActual) {

        Empresa empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        // Validar que el usuario actual puede modificar la empresa (owner o ADMIN)
        if (!puedeModificarEmpresa(empresa, usuarioIdActual)) {
            throw new IllegalStateException("Solo el owner o un ADMIN pueden agregar reclutadores");
        }

        if (usuarioRepository.findByCorreo(nuevoReclutador.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo already in use");
        }

        Reclutador guardado = usuarioRepository.save(nuevoReclutador);
        empresa.getReclutadores().add(guardado);

        return empresaRepository.save(empresa);
    }

    // ===== UPDATE =====
    public Empresa update(Long id, Empresa request, Long usuarioIdActual) {

        Empresa existingEmpresa = empresaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        // Validar que el usuario actual puede modificar (owner o ADMIN)
        if (!puedeModificarEmpresa(existingEmpresa, usuarioIdActual)) {
            throw new IllegalStateException("Solo el owner o un ADMIN pueden actualizar esta empresa");
        }

        existingEmpresa.setNombre(request.getNombre());
        existingEmpresa.setDescripcion(request.getDescripcion());
        existingEmpresa.setNumeroTrabajadores(request.getNumeroTrabajadores());
        existingEmpresa.setEmailContacto(request.getEmailContacto());
        existingEmpresa.setTelefonoContacto(request.getTelefonoContacto());
        existingEmpresa.setWebsite(request.getWebsite());
        existingEmpresa.setLogoUrl(request.getLogoUrl());
        existingEmpresa.setRazonSocial(request.getRazonSocial());
        existingEmpresa.setCategories(request.getCategories());

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                .orElseThrow(() -> new RuntimeException("Municipio not found"));
            existingEmpresa.setMunicipio(municipio);
        }

        return empresaRepository.save(existingEmpresa);
    }

    // ===== UPDATE (ADMIN - sin restricciones) =====
    public Empresa updateAdmin(Long id, Empresa request) {
        Empresa existingEmpresa = empresaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        existingEmpresa.setNombre(request.getNombre());
        existingEmpresa.setDescripcion(request.getDescripcion());
        existingEmpresa.setNumeroTrabajadores(request.getNumeroTrabajadores());
        existingEmpresa.setEmailContacto(request.getEmailContacto());
        existingEmpresa.setTelefonoContacto(request.getTelefonoContacto());
        existingEmpresa.setWebsite(request.getWebsite());
        existingEmpresa.setLogoUrl(request.getLogoUrl());
        existingEmpresa.setRazonSocial(request.getRazonSocial());
        existingEmpresa.setCategories(request.getCategories());

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                .orElseThrow(() -> new RuntimeException("Municipio not found"));
            existingEmpresa.setMunicipio(municipio);
        }

        return empresaRepository.save(existingEmpresa);
    }

    // ===== DELETE =====
    public void delete(Long id, Long usuarioIdActual) {
        Empresa existingEmpresa = empresaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        if (!puedeModificarEmpresa(existingEmpresa, usuarioIdActual)) {
            throw new IllegalStateException("Solo el owner o un ADMIN pueden eliminar esta empresa");
        }

        empresaRepository.delete(existingEmpresa);
    }

    // ===== DELETE (ADMIN - sin restricciones) =====
    public void deleteAdmin(Long id) {
        Empresa existingEmpresa = empresaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        empresaRepository.delete(existingEmpresa);
    }

    public void removeReclutador(Long empresaId, Long reclutadorId, Long usuarioIdActual) {

        Empresa empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        // Validar que el usuario actual puede modificar (owner o ADMIN)
        if (!puedeModificarEmpresa(empresa, usuarioIdActual)) {
            throw new IllegalStateException("Solo el owner o un ADMIN pueden remover reclutadores");
        }

        if (empresa.getReclutadorOwner() != null && empresa.getReclutadorOwner().getId().equals(reclutadorId)) {
            throw new RuntimeException("Cannot remove owner directly");
        }

        boolean removed = empresa.getReclutadores().removeIf(u -> u.getId().equals(reclutadorId));
        if (!removed) {
            throw new RuntimeException("Reclutador not found in empresa");
        }

        Reclutador reclutador = usuarioRepository.findById(reclutadorId)
            .orElseThrow(() -> new RuntimeException("Reclutador not found"));
        reclutador.setIsActive(false);
        usuarioRepository.save(reclutador);

        empresaRepository.save(empresa);
    }

    // ===== CODIGO INVITACION =====
    public String getCodigoInvitacion(Long empresaId, Long usuarioIdActual) {

        Empresa empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        // Validar que el usuario actual puede ver el código (owner o ADMIN)
        if (!puedeModificarEmpresa(empresa, usuarioIdActual)) {
            throw new IllegalStateException("Solo el owner o un ADMIN pueden ver el código de invitación");
        }

        return empresa.getCodigoInvitacion();
    }

    public String regenerarCodigoInvitacion(Long empresaId, Long usuarioIdActual) {

        Empresa empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        // Validar que el usuario actual puede regenerar (owner o ADMIN)
        if (!puedeModificarEmpresa(empresa, usuarioIdActual)) {
            throw new IllegalStateException("Solo el owner o un ADMIN pueden regenerar el código");
        }

        empresa.generarCodigoInvitacion();
        empresaRepository.save(empresa);
        return empresa.getCodigoInvitacion();
    }

    public boolean validarCodigoInvitacion(String nit, String codigo) {
        Optional<Empresa> opt = empresaRepository.findByNit(nit);
        if (opt.isEmpty()) return false;
        Empresa empresa = opt.get();
        return empresa.getCodigoInvitacion() != null && empresa.getCodigoInvitacion().equals(codigo);
    }

    public Empresa unirseAEmpresaConCodigo(String nit, String codigoInvitacion, Reclutador nuevoReclutador) {
        if (nit == null || nit.isEmpty()) {
            throw new IllegalArgumentException("NIT requerido");
        }
        if (codigoInvitacion == null || codigoInvitacion.isEmpty()) {
            throw new IllegalArgumentException("Código de invitación requerido");
        }
        if (nuevoReclutador == null) {
            throw new IllegalArgumentException("Datos del reclutador requeridos");
        }

        // 1. Buscar empresa por NIT
        Empresa empresa = empresaRepository.findByNit(nit)
                .orElseThrow(() -> new RuntimeException("Empresa no encontrada con NIT: " + nit));

        // 2. Validar que la empresa está activa
        if (!empresa.getIsActive()) {
            throw new IllegalStateException("La empresa no está activa");
        }

        // 3. Validar código de invitación
        if (!validarCodigoInvitacion(nit, codigoInvitacion)) {
            throw new IllegalArgumentException("Código de invitación inválido");
        }

        // 4. Verificar que el correo no esté ya en uso
        if (usuarioRepository.findByCorreo(nuevoReclutador.getCorreo()).isPresent()) {
            throw new RuntimeException("El correo ya está registrado");
        }

        // 5. Guardar el nuevo reclutador
        Reclutador reclutadorGuardado = usuarioRepository.save(nuevoReclutador);

        // 6. Agregar a la lista de reclutadores de la empresa
        empresa.getReclutadores().add(reclutadorGuardado);

        // 7. Guardar la empresa actualizada
        return empresaRepository.save(empresa);
    }

    private boolean puedeModificarEmpresa(Empresa empresa, Long usuarioId) {
        Reclutador usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Reclutador no encontrado"));
        
        // Es el owner de la empresa
        if (empresa.getReclutadorOwner() != null && 
            empresa.getReclutadorOwner().getId().equals(usuarioId)) {
            return true;
        }
        
        return false;
    }
}
