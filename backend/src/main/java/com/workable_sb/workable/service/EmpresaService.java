package com.workable_sb.workable.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workable_sb.workable.models.Empresa;
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

  // ===== CREACIÓN =====
  public Empresa registrarEmpresaConOwner(Empresa empresa, Usuario reclutadorOwner) {
    // Validaciones básicas
    if (empresa == null) throw new IllegalArgumentException("Empresa no puede ser null");
    if (reclutadorOwner == null) throw new IllegalArgumentException("Reclutador owner no puede ser null");

    if (empresa.getNit() == null || empresa.getNit().isEmpty()) {
      throw new IllegalArgumentException("El NIT de la empresa es obligatorio");
    }

    if (empresaRepository.existsByNit(empresa.getNit())) {
      throw new IllegalStateException("Ya existe una empresa con ese NIT");
    }

    if (reclutadorOwner.getCorreo() == null || reclutadorOwner.getCorreo().isEmpty()) {
      throw new IllegalArgumentException("El correo del reclutador es obligatorio");
    }

    if (usuarioRepository.existsByCorreo(reclutadorOwner.getCorreo())) {
      throw new IllegalStateException("El correo del reclutador ya está registrado");
    }

    if (reclutadorOwner.getRol() == null || reclutadorOwner.getRol() != Usuario.Rol.RECLUTADOR) {
      throw new IllegalArgumentException("El usuario debe tener rol RECLUTADOR");
    }

    // Guardar usuario primero para tener id
    Usuario ownerGuardado = usuarioRepository.save(reclutadorOwner);

    // Asignar owner y vincular
    empresa.setReclutadorOwner(ownerGuardado);
    empresa.getReclutadores().add(ownerGuardado);

    // Guardar empresa (generará codigoInvitacion en @PrePersist)
    Empresa empresaGuardada = empresaRepository.save(empresa);

    return empresaGuardada;
  }

  public Empresa agregarReclutador(String nitEmpresa, String codigoInvitacion, Usuario nuevoReclutador) {
    if (nitEmpresa == null || nitEmpresa.isEmpty()) throw new IllegalArgumentException("NIT requerido");
    if (nuevoReclutador == null) throw new IllegalArgumentException("Usuario requerido");

    Empresa empresa = empresaRepository.findByNit(nitEmpresa)
        .orElseThrow(() -> new RuntimeException("Empresa no encontrada con NIT: " + nitEmpresa));

    if (!validarCodigoInvitacion(nitEmpresa, codigoInvitacion)) {
      throw new IllegalStateException("Código de invitación inválido");
    }

    if (usuarioRepository.existsByCorreo(nuevoReclutador.getCorreo())) {
      throw new IllegalStateException("El correo ya está registrado");
    }

    if (nuevoReclutador.getRol() == null || nuevoReclutador.getRol() != Usuario.Rol.RECLUTADOR) {
      throw new IllegalArgumentException("El usuario debe tener rol RECLUTADOR");
    }

    // Guardar usuario primero
    Usuario guardado = usuarioRepository.save(nuevoReclutador);

    // Agregar a la empresa
    empresa.getReclutadores().add(guardado);
    empresaRepository.save(empresa);

    return empresa;
  }

  // ===== CONSULTAS =====
  public Empresa obtenerPorId(Long id) {
    return empresaRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Empresa no encontrada con id: " + id));
  }

  public Empresa obtenerPorNit(String nit) {
    return empresaRepository.findByNit(nit)
        .orElseThrow(() -> new RuntimeException("Empresa no encontrada con NIT: " + nit));
  }

  public List<Empresa> listarTodas() {
    return empresaRepository.findAll();
  }

  public List<Empresa> listarActivas() {
    return empresaRepository.findByIsActive(true);
  }

  public List<Empresa> buscarPorNombre(String nombre) {
    if (nombre == null) return listarTodas();
    return empresaRepository.findByNombreContainingIgnoreCase(nombre);
  }

  // ===== RECLUTADORES =====
  public List<Usuario> obtenerReclutadores(Long empresaId) {
    Empresa e = obtenerPorId(empresaId);
    return e.getReclutadores();
  }

  public boolean esOwner(Long empresaId, String correoUsuario) {
    Empresa e = obtenerPorId(empresaId);
    if (e.getReclutadorOwner() == null) return false;
    return e.getReclutadorOwner().getCorreo().equalsIgnoreCase(correoUsuario);
  }

  public boolean perteneceAEmpresa(Long empresaId, Long usuarioId) {
    Empresa e = obtenerPorId(empresaId);
    return e.getReclutadores().stream().anyMatch(u -> u.getId().equals(usuarioId));
  }

  // ===== CÓDIGO INVITACIÓN =====
  public String obtenerCodigoInvitacion(Long empresaId, String correoUsuarioActual) {
    Empresa e = obtenerPorId(empresaId);
    
    // Permitir al owner o ADMIN ver el código
    if (!puedeModificarEmpresa(e, correoUsuarioActual)) {
      throw new IllegalStateException("Solo el owner o un administrador pueden ver el código de invitación");
    }
    
    return e.getCodigoInvitacion();
  }

  public String regenerarCodigoInvitacion(Long empresaId, String correoUsuarioActual) {
    Empresa e = obtenerPorId(empresaId);
    
    // Permitir al owner o ADMIN regenerar el código
    if (!puedeModificarEmpresa(e, correoUsuarioActual)) {
      throw new IllegalStateException("Solo el owner o un administrador pueden regenerar el código");
    }
    
    e.generarCodigoInvitacion();
    empresaRepository.save(e);
    return e.getCodigoInvitacion();
  }

  public boolean validarCodigoInvitacion(String nit, String codigo) {
    Optional<Empresa> opt = empresaRepository.findByNit(nit);
    if (opt.isEmpty()) return false;
    Empresa e = opt.get();
    return e.getCodigoInvitacion() != null && e.getCodigoInvitacion().equals(codigo);
  }

  // ===== ACTUALIZACIÓN (owner o ADMIN) =====
  public Empresa actualizarEmpresa(Long id, Empresa empresaActualizada, String correoUsuarioActual) {
    Empresa existente = obtenerPorId(id);
    
    // Validar que es owner o ADMIN
    if (!puedeModificarEmpresa(existente, correoUsuarioActual)) {
      throw new IllegalStateException("Solo el owner o un administrador pueden actualizar la empresa");
    }

    // Actualizar campos permitidos
    existente.setNombre(empresaActualizada.getNombre());
    existente.setDescripcion(empresaActualizada.getDescripcion());
    existente.setNumeroTrabajadores(empresaActualizada.getNumeroTrabajadores());
    existente.setEmailContacto(empresaActualizada.getEmailContacto());
    existente.setTelefonoContacto(empresaActualizada.getTelefonoContacto());
    existente.setWebsite(empresaActualizada.getWebsite());
    existente.setLogoUrl(empresaActualizada.getLogoUrl());
    existente.setRazonSocial(empresaActualizada.getRazonSocial());
    existente.setCategories(empresaActualizada.getCategories());

    if (empresaActualizada.getMunicipio() != null) {
      // validar existencia del municipio
      municipioRepo.findById(empresaActualizada.getMunicipio().getId())
        .orElseThrow(() -> new RuntimeException("Municipio no encontrado"));
      existente.setMunicipio(empresaActualizada.getMunicipio());
    }

    return empresaRepository.save(existente);
  }

  public void eliminarEmpresa(Long id, String correoUsuarioActual) {
    Empresa existente = obtenerPorId(id);
    
    // Validar que es owner o ADMIN
    if (!puedeModificarEmpresa(existente, correoUsuarioActual)) {
      throw new IllegalStateException("Solo el owner o un administrador pueden eliminar la empresa");
    }
    
    existente.setIsActive(false);
    empresaRepository.save(existente);
  }

  public void removerReclutador(Long empresaId, Long reclutadorId, String correoUsuarioActual) {
    Empresa e = obtenerPorId(empresaId);

    // validar que quien llama es ADMIN
    Usuario usuarioActual = usuarioRepository.findByCorreo(correoUsuarioActual)
        .orElseThrow(() -> new RuntimeException("Usuario que realiza la acción no encontrado"));

    if (usuarioActual.getRol() != Usuario.Rol.ADMIN) {
      throw new IllegalStateException("Solo un administrador puede remover reclutadores");
    }

    // Proteger al owner: no se remueve al owner sin transferencia previa
    if (e.getReclutadorOwner() != null && e.getReclutadorOwner().getId().equals(reclutadorId)) {
      throw new IllegalStateException("No se puede remover al owner directamente. Transfiera la propiedad primero o contacte al administrador del sistema.");
    }

    boolean removed = e.getReclutadores().removeIf(u -> u.getId().equals(reclutadorId));
    if (!removed) {
      throw new RuntimeException("El reclutador no pertenece a la empresa");
    }

    // desactivar usuario removido
    Usuario usr = usuarioRepository.findById(reclutadorId)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    usr.setIsActive(false);
    usuarioRepository.save(usr);

    empresaRepository.save(e);
  }

  // ===== MÉTODOS AUXILIARES =====
  /**
   * Verifica si un usuario puede modificar una empresa (es el owner o es ADMIN)
   */
  private boolean puedeModificarEmpresa(Empresa empresa, String correoUsuario) {
    Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    
    // Es ADMIN o es el owner
    if (usuario.getRol() == Usuario.Rol.ADMIN) {
      return true;
    }
    
    if (empresa.getReclutadorOwner() == null) {
      return false;
    }
    
    return empresa.getReclutadorOwner().getCorreo().equalsIgnoreCase(correoUsuario);
  }

}
