package com.workable_sb.workable.dto;

/**
 * Deprecated placeholder. The backend now uses the domain model `Oferta` directly
 * for request/response mapping. This class is kept temporarily for compatibility
 * and will be removed when all clients and references are migrated.
 */
@Deprecated
public class OfertaDTO {
    // Minimal DTO kept for compatibility with older clients. Only include the changed field
    // `requisitos` as a String (no nulo, max 500 caracteres).

    private String requisitos;

    public OfertaDTO() {}

    public OfertaDTO(String requisitos) {
        this.requisitos = requisitos;
    }

    public String getRequisitos() {
        return requisitos;
    }

    public void setRequisitos(String requisitos) {
        this.requisitos = requisitos;
    }
}
