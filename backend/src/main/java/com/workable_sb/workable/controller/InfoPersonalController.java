package com.workable_sb.workable.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.dto.InfoAspiranteDto;

import com.workable_sb.workable.service.InfoPersonalService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/infopersonal")
public class InfoPersonalController {
    @Autowired
    private InfoPersonalService infoPersonalService;

    public InfoPersonalController(InfoPersonalService infoPersonalService) {
        this.infoPersonalService = infoPersonalService;
    }

    @PostMapping
    public ResponseEntity<InfoAspiranteDto> crearyupdate(@Valid @RequestBody InfoAspiranteDto infoPersonalDto) {
        InfoAspiranteDto infoPersonalDto2 = infoPersonalService.crearyupdate(infoPersonalDto);
        return ResponseEntity.ok(infoPersonalDto2);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<InfoAspiranteDto> buscarporId(@PathVariable Integer infoPersonal_id) {
        InfoAspiranteDto infoPersonalDto =  infoPersonalService.buscarporId(infoPersonal_id);
        return ResponseEntity.ok(infoPersonalDto);
    }

    @GetMapping
    public ResponseEntity<List<InfoAspiranteDto>> listPersonal() {
        List<InfoAspiranteDto> infoPersonalDtos = infoPersonalService.listPersonal();
        return ResponseEntity.ok(infoPersonalDtos);
    }

    @DeleteMapping("/id")
    public ResponseEntity<Void> eliminarPersonal(@PathVariable Integer infoPersonal_id) {
        infoPersonalService.eliminarPersonal(infoPersonal_id);
        return ResponseEntity.noContent().build();
    }

}
