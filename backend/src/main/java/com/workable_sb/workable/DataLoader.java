package com.workable_sb.workable;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.workable_sb.workable.models.Categoria;
import com.workable_sb.workable.models.Genero;
import com.workable_sb.workable.models.Municipio;
import com.workable_sb.workable.models.TipDocumento;
import com.workable_sb.workable.repository.CategoriaRepository;
import com.workable_sb.workable.repository.GeneroRepository;
import com.workable_sb.workable.repository.MunicipioRepository;
import com.workable_sb.workable.repository.TipDocumentoRepository;

@Component
public class DataLoader implements CommandLineRunner {

    private final TipDocumentoRepository tipDocumentoRepository;
    private final MunicipioRepository municipioRepository;
    private final GeneroRepository generoRepository;
    private final CategoriaRepository categoriaRepository;

    public DataLoader(TipDocumentoRepository tipDocumentoRepository,
                      MunicipioRepository municipioRepository,
                      GeneroRepository generoRepository,
                      CategoriaRepository categoriaRepository) {
        this.tipDocumentoRepository = tipDocumentoRepository;
        this.municipioRepository = municipioRepository;
        this.generoRepository = generoRepository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (tipDocumentoRepository.count() == 0) {
            try {
                java.lang.reflect.Field idField = TipDocumento.class.getDeclaredField("tipoDocumento_id");
                idField.setAccessible(true);
                TipDocumento td1 = new TipDocumento();
                idField.set(td1, 1);
                java.lang.reflect.Field nombreField = TipDocumento.class.getDeclaredField("nombre");
                nombreField.setAccessible(true);
                nombreField.set(td1, "C.C");
                tipDocumentoRepository.save(td1);
            } catch (Exception ex) {
                // ignore if reflective access fails
            }
        }

        if (municipioRepository.count() == 0) {
            try {
                Municipio m = new Municipio();
                java.lang.reflect.Field idF = Municipio.class.getDeclaredField("municipio_id");
                idF.setAccessible(true);
                idF.set(m, 1);
                java.lang.reflect.Field nombreF = Municipio.class.getDeclaredField("nombre");
                nombreF.setAccessible(true);
                nombreF.set(m, "BOGOTA D.C");
                municipioRepository.save(m);
            } catch (Exception ex) {}
        }

        if (generoRepository.count() == 0) {
            try {
                Genero g = new Genero();
                java.lang.reflect.Field idF = Genero.class.getDeclaredField("genero_id");
                idF.setAccessible(true);
                idF.set(g, 1);
                java.lang.reflect.Field nombreF = Genero.class.getDeclaredField("nombre");
                nombreF.setAccessible(true);
                nombreF.set(g, "Masculino");
                generoRepository.save(g);
            } catch (Exception ex) {}
        }

        if (categoriaRepository.count() == 0) {
            try {
                Categoria c = new Categoria();
                java.lang.reflect.Field idF = Categoria.class.getDeclaredField("categoria_id");
                idF.setAccessible(true);
                idF.set(c, 1);
                java.lang.reflect.Field nombreF = Categoria.class.getDeclaredField("nombre");
                nombreF.setAccessible(true);
                nombreF.set(c, "TECNOLOGIA");
                categoriaRepository.save(c);
            } catch (Exception ex) {}
        }
    }
}
