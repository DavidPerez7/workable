package com.workable_sb.workable;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DataSqlLoader implements CommandLineRunner {

    private final JdbcTemplate jdbc;

    public DataSqlLoader(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(String... args) throws Exception {
        // departamentos
        jdbc.update("INSERT IGNORE INTO departamento (departamento_id, nombre) VALUES (?, ?)", 1, "BOGOTA D.C");

        // municipios (require departamento)
        jdbc.update("INSERT IGNORE INTO municipio (municipio_id, nombre, departamento_id) VALUES (?, ?, ?)", 1, "BOGOTA D.C", 1);

        // tipo_documento
        jdbc.update("INSERT IGNORE INTO tipo_documento (tipo_documento_id, nombre, numero_documento) VALUES (?, ?, ?)", 1, "C.C", 123456789);

        // genero (Short handled as smallint)
        jdbc.update("INSERT IGNORE INTO genero (genero_id, nombre) VALUES (?, ?)", 1, "Masculino");

        // categoria -> imagen is blob and not null; insert an empty blob via unhex('') or defaulting to empty string cast
        try {
            jdbc.update("INSERT IGNORE INTO categoria (categoria_id, nombre, imagen, descripcion) VALUES (?, ?, ?, ?)", 1, "TECNOLOGIA", new byte[0], "Empresas de tecnologia");
        } catch (Exception ex) {
            // Fallback: try without imagen if DB doesn't accept byte[] directly
            try {
                jdbc.update("INSERT IGNORE INTO categoria (categoria_id, nombre, descripcion) VALUES (?, ?, ?)", 1, "TECNOLOGIA", "Empresas de tecnologia");
            } catch (Exception inner) {
                // ignore
            }
        }
    }
}
