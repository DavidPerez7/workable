package com.workable_sb.workable.config;

import java.io.IOException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.workable_sb.workable.models.Habilidad.TipoHabilidad;

public class TipoHabilidadDeserializer extends JsonDeserializer<TipoHabilidad> {
    @Override
    public TipoHabilidad deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();
        if (value == null || value.isEmpty()) {
            return null;
        }
        try {
            return TipoHabilidad.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IOException("TipoHabilidad inválido: " + value + ". Valores válidos: " + 
                String.join(", ", java.util.Arrays.stream(TipoHabilidad.values()).map(Enum::name).toArray(String[]::new)));
        }
    }
}
