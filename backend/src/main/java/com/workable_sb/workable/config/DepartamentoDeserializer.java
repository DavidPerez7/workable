package com.workable_sb.workable.config;

import java.io.IOException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.workable_sb.workable.models.Municipio.Departamento;

public class DepartamentoDeserializer extends JsonDeserializer<Departamento> {
    @Override
    public Departamento deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();
        if (value == null || value.isEmpty()) {
            return null;
        }
        try {
            return Departamento.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IOException("Departamento inválido: " + value + ". Valores válidos: " + 
                String.join(", ", java.util.Arrays.stream(Departamento.values()).map(Enum::name).toArray(String[]::new)));
        }
    }
}
