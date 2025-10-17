package com.workable_sb.workable.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.PostulacionDto;
import com.workable_sb.workable.service.PostulacionService;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RequestMapping("/api/postulacion")
@RestController
public class PostulacionController {

  private PostulacionService postulacionService;
  
  public PostulacionController (PostulacionService postulacionService) {
    this.postulacionService = postulacionService;
  }

  @PostMapping
  public ResponseEntity<PostulacionDto> crear(@Valid @RequestBody PostulacionDto postulacionDto) {
      PostulacionDto guardado = postulacionService.crear(postulacionDto);
      return ResponseEntity.ok(guardado);
  }
  
  @GetMapping("/{id}")
  public ResponseEntity<PostulacionDto> listId(@PathVariable Integer id) {
      PostulacionDto guardado = postulacionService.listId(id);
      return ResponseEntity.ok(guardado);
  }
  
  @GetMapping
  public ResponseEntity<List<PostulacionDto>>listarAll(){
    List<PostulacionDto> postulaciones = postulacionService.listarAll();
    return ResponseEntity.ok(postulaciones);
  }

  @DeleteMapping
  public ResponseEntity<Void> eliminar(@PathVariable Integer id){
    postulacionService.eliminar(id);
    return ResponseEntity.noContent().build();
  }
    
}
