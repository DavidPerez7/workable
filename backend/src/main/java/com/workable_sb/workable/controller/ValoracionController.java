package com.workable_sb.workable.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.ValoracionDto;
import com.workable_sb.workable.dto.ValoracionReadDto;
import com.workable_sb.workable.service.ValoracionService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/valoraciones")
public class ValoracionController {

  private final ValoracionService valoracionService;

  public ValoracionController(ValoracionService valoracionService){
    this.valoracionService = valoracionService;
  }

  @PostMapping
  public ResponseEntity<ValoracionReadDto> crear(@Valid @RequestBody ValoracionDto valoracionDto) {
    ValoracionReadDto creado = valoracionService.crear(valoracionDto);
    return ResponseEntity.ok(creado);
  }

  @GetMapping("/{id}")
  public ResponseEntity<ValoracionReadDto> listarId(@PathVariable Integer id) {
    ValoracionReadDto valoracionDto =  valoracionService.listarId(id);
      return ResponseEntity.ok(valoracionDto);
  }

  @GetMapping
  public ResponseEntity<List<ValoracionReadDto>> listarTodo(){
    List<ValoracionReadDto> valoraciones = valoracionService.listarAll();
      return ResponseEntity.ok(valoraciones);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> eliminar(@PathVariable Integer id){
    valoracionService.eliminar(id);
    return ResponseEntity.noContent().build();
  }
}
