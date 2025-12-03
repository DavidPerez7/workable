package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.repository.MunicipioRepo;
import com.workable_sb.workable.repository.UsuarioRepo;

@Service
@Transactional
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private UsuarioRepo usuarioRepository;

    @Autowired
    private MunicipioRepo municipioRepo;

    // - READ
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
    public List<Usuario> getReclutadores(Long empresaId) {
        Empresa empresa = empresaRepository.findById(empresaId).orElseThrow(() -> new RuntimeException("Empresa not found"));
        return empresa.getReclutadores();
    }

    // - CREATE
    public Empresa create(Empresa request) {
        if (empresaRepository.existsByNit(request.getNit())) {
            throw new RuntimeException("NIT already in use");
        }

        if (request.getMunicipio() != null) {
            Municipio municipio = municipioRepo.findById(request.getMunicipio().getId())
                .orElseThrow(() -> new RuntimeException("Municipio not found"));
            request.setMunicipio(municipio);
        }

        return empresaRepository.save(request);
    }

    public Empresa createWithOwner(Empresa empresa, Usuario reclutadorOwner) {
        if (empresaRepository.existsByNit(empresa.getNit())) {
            throw new RuntimeException("NIT already in use");
        }

        if (usuarioRepository.findByCorreo(reclutadorOwner.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo already in use");
        }

        Usuario ownerGuardado = usuarioRepository.save(reclutadorOwner);

        empresa.setReclutadorOwner(ownerGuardado);
        empresa.getReclutadores().add(ownerGuardado);

        return empresaRepository.save(empresa);
    }

    public Empresa addReclutador(Long empresaId, Usuario nuevoReclutador) {
        Empresa empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        if (usuarioRepository.findByCorreo(nuevoReclutador.getCorreo()).isPresent()) {
            throw new RuntimeException("Correo already in use");
        }

        Usuario guardado = usuarioRepository.save(nuevoReclutador);
        empresa.getReclutadores().add(guardado);

        return empresaRepository.save(empresa);
    }

    // - UPDATE
    public Empresa update(Long id, Empresa request) {
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

    // -DELETE
    public void delete(Long id) {
        Empresa existingEmpresa = empresaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        existingEmpresa.setIsActive(false);
        empresaRepository.save(existingEmpresa);
    }

    public void removeReclutador(Long empresaId, Long reclutadorId) {
        Empresa empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

        if (empresa.getReclutadorOwner() != null && empresa.getReclutadorOwner().getId().equals(reclutadorId)) {
            throw new RuntimeException("Cannot remove owner directly");
        }

        boolean removed = empresa.getReclutadores().removeIf(u -> u.getId().equals(reclutadorId));
        if (!removed) {
            throw new RuntimeException("Reclutador not found in empresa");
        }

        Usuario reclutador = usuarioRepository.findById(reclutadorId)
            .orElseThrow(() -> new RuntimeException("Usuario not found"));
        reclutador.setIsActive(false);
        usuarioRepository.save(reclutador);

        empresaRepository.save(empresa);
    }

    // - CODIGO INVITACION
    public String getCodigoInvitacion(Long empresaId) {
        Empresa empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));
        return empresa.getCodigoInvitacion();
    }

    public String regenerarCodigoInvitacion(Long empresaId) {
        Empresa empresa = empresaRepository.findById(empresaId)
            .orElseThrow(() -> new RuntimeException("Empresa not found"));

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
}
