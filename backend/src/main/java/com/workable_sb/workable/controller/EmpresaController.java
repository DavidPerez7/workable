package com.workable_sb.workable.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.models.Usuario;
import com.workable_sb.workable.service.EmpresaService;
import com.workable_sb.workable.service.UsuarioService;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @Autowired
    private UsuarioService usuarioService;

    // ===== READ =====
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return empresaService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Empresa>> getAll() {
        return ResponseEntity.ok(empresaService.getAll());
    }

    @GetMapping("/nit/{nit}")
    public ResponseEntity<?> getByNit(@PathVariable String nit) {
        return empresaService.getByNit(nit)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Empresa>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(empresaService.getByNombre(nombre));
    }

    @GetMapping("/activas")
    public ResponseEntity<List<Empresa>> getActivas() {
        return ResponseEntity.ok(empresaService.getByIsActive(true));
    }

    @GetMapping("/{empresaId}/reclutadores")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<List<Usuario>> getReclutadores(@PathVariable Long empresaId) {
        return ResponseEntity.ok(empresaService.getReclutadores(empresaId));
    }

    // ===== CREATE =====
    @PostMapping
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> create(@RequestBody Empresa empresa, Authentication auth) {
        Long usuarioId = getUsuarioIdFromAuth(auth);
        Empresa created = empresaService.create(empresa, usuarioId);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/con-owner")
    public ResponseEntity<?> createWithOwner(@RequestBody Map<String, Object> request) {
        Empresa empresa = new Empresa();
        empresa.setNombre((String) request.get("nombre"));
        empresa.setDescripcion((String) request.get("descripcion"));
        empresa.setNumeroTrabajadores((Integer) request.get("numeroTrabajadores"));
        empresa.setNit((String) request.get("nit"));
        empresa.setRazonSocial((String) request.get("razonSocial"));
        empresa.setEmailContacto((String) request.get("emailContacto"));
        empresa.setTelefonoContacto((String) request.get("telefonoContacto"));
        empresa.setWebsite((String) request.get("website"));
        empresa.setLogoUrl((String) request.get("logoUrl"));

        @SuppressWarnings("unchecked")
        Map<String, Object> ownerData = (Map<String, Object>) request.get("reclutadorOwner");
        Usuario owner = new Usuario();
        owner.setNombre((String) ownerData.get("nombre"));
        owner.setApellido((String) ownerData.get("apellido"));
        owner.setCorreo((String) ownerData.get("correo"));
        owner.setPassword((String) ownerData.get("password"));
        owner.setTelefono((String) ownerData.get("telefono"));
        owner.setRol(Usuario.Rol.RECLUTADOR);

        Empresa created = empresaService.createWithOwner(empresa, owner);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/{empresaId}/reclutadores")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> addReclutador(
            @PathVariable Long empresaId,
            @RequestBody Usuario nuevoReclutador,
            Authentication auth) {
        Long usuarioId = getUsuarioIdFromAuth(auth);
        nuevoReclutador.setRol(Usuario.Rol.RECLUTADOR);
        Empresa updated = empresaService.addReclutador(empresaId, nuevoReclutador, usuarioId);
        return ResponseEntity.ok(updated);
    }

    // ===== UPDATE =====
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @RequestBody Empresa empresa,
            Authentication auth) {
        Long usuarioId = getUsuarioIdFromAuth(auth);
        Empresa updated = empresaService.update(id, empresa, usuarioId);
        return ResponseEntity.ok(updated);
    }

    // ===== DELETE =====
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication auth) {
        Long usuarioId = getUsuarioIdFromAuth(auth);
        empresaService.delete(id, usuarioId);
        return ResponseEntity.ok(Map.of("mensaje", "Empresa eliminada exitosamente"));
    }

    @DeleteMapping("/{empresaId}/reclutadores/{reclutadorId}")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> removeReclutador(
            @PathVariable Long empresaId,
            @PathVariable Long reclutadorId,
            Authentication auth) {
        Long usuarioId = getUsuarioIdFromAuth(auth);
        empresaService.removeReclutador(empresaId, reclutadorId, usuarioId);
        return ResponseEntity.ok(Map.of("mensaje", "Reclutador removido exitosamente"));
    }

    // ===== CODIGO INVITACION =====
    @GetMapping("/{empresaId}/codigo-invitacion")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> getCodigoInvitacion(@PathVariable Long empresaId, Authentication auth) {
        Long usuarioId = getUsuarioIdFromAuth(auth);
        String codigo = empresaService.getCodigoInvitacion(empresaId, usuarioId);
        return ResponseEntity.ok(Map.of("codigoInvitacion", codigo));
    }

    @PostMapping("/{empresaId}/regenerar-codigo")
    @PreAuthorize("hasAnyRole('RECLUTADOR', 'ADMIN')")
    public ResponseEntity<?> regenerarCodigoInvitacion(@PathVariable Long empresaId, Authentication auth) {
        Long usuarioId = getUsuarioIdFromAuth(auth);
        String nuevoCodigo = empresaService.regenerarCodigoInvitacion(empresaId, usuarioId);
        return ResponseEntity.ok(Map.of("codigoInvitacion", nuevoCodigo));
    }

    @PostMapping("/validar-codigo")
    public ResponseEntity<?> validarCodigo(@RequestBody Map<String, String> request) {
        String nit = request.get("nit");
        String codigo = request.get("codigoInvitacion");
        boolean valido = empresaService.validarCodigoInvitacion(nit, codigo);
        return ResponseEntity.ok(Map.of("valido", valido));
    }

    @PostMapping("/unirse")
    public ResponseEntity<?> unirseConCodigo(@RequestBody Map<String, Object> request) {
        String nit = (String) request.get("nit");
        String codigoInvitacion = (String) request.get("codigoInvitacion");

        @SuppressWarnings("unchecked")
        Map<String, Object> reclutadorData = (Map<String, Object>) request.get("reclutador");
        Usuario nuevoReclutador = new Usuario();
        nuevoReclutador.setNombre((String) reclutadorData.get("nombre"));
        nuevoReclutador.setApellido((String) reclutadorData.get("apellido"));
        nuevoReclutador.setCorreo((String) reclutadorData.get("correo"));
        nuevoReclutador.setPassword((String) reclutadorData.get("password"));
        nuevoReclutador.setTelefono((String) reclutadorData.get("telefono"));
        nuevoReclutador.setRol(Usuario.Rol.RECLUTADOR);

        Empresa empresa = empresaService.unirseAEmpresaConCodigo(nit, codigoInvitacion, nuevoReclutador);
        return ResponseEntity.ok(Map.of(
                "mensaje", "Te has unido exitosamente a la empresa",
                "empresa", empresa
        ));
    }

    // ===== HELPER =====
    private Long getUsuarioIdFromAuth(Authentication auth) {
        String correo = auth.getName();
        return usuarioService.getByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"))
                .getId();
    }
}
