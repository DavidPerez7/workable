package com.workable_sb.workable.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.repository.MunicipioRepo;

@RestController
@RequestMapping("/api/municipio")
public class MunicipioController {

    @Autowired
    private MunicipioRepo municipioRepo;

    @GetMapping
    public ResponseEntity<List<Municipio>> getAll() {
        return ResponseEntity.ok(municipioRepo.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Municipio>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(municipioRepo.findById(id));
    }
}
