package com.workable_sb.workable.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.EmpresaDto;
import com.workable_sb.workable.dto.EmpresaReadDto;
import com.workable_sb.workable.models.Empresa;
import com.workable_sb.workable.repository.EmpresaRepository;
import com.workable_sb.workable.service.EmpresaService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/empresa")
public class EmpresaController {

  @Autowired
  private EmpresaRepository empresaRepo;
  private EmpresaService empresaServ;

  public EmpresaController(EmpresaService empresaService) {
    this.empresaServ = empresaService;
  }

  @GetMapping("/all")
  public List<Empresa> listAll() {
      return empresaRepo.findAll();
  }
  

  @PostMapping
  public ResponseEntity<?> guardar(@Valid @RequestBody EmpresaDto dto) {
      try {
          EmpresaReadDto guardado = empresaServ.guardar(dto);
          return ResponseEntity.ok(guardado);
      } catch (jakarta.persistence.EntityNotFoundException e) {
          return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
      } catch (org.springframework.dao.DataIntegrityViolationException e) {
          return ResponseEntity.badRequest().body(java.util.Map.of("error", "El NIT ya está registrado o hay un problema con los datos"));
      } catch (Exception e) {
          e.printStackTrace();
          return ResponseEntity.badRequest().body(java.util.Map.of("error", "Error al crear empresa: " + e.getMessage()));
      }
  }

  @GetMapping("/{id}")
  public ResponseEntity<EmpresaReadDto> listId(@PathVariable Long id) {
      EmpresaReadDto dto = empresaServ.listId(id);
      return ResponseEntity.ok(dto);
  }

  @GetMapping
  public ResponseEntity<List<EmpresaReadDto>> listAllDto() {
      List<EmpresaReadDto> empresas = empresaServ.listAll();
      return ResponseEntity.ok(empresas);
    }
  
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> eliminar(@PathVariable Long id) {
    empresaServ.eliminar(id);
    return ResponseEntity.noContent().build();
  }
}
