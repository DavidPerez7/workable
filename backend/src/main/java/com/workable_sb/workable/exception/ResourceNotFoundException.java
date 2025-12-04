package com.workable_sb.workable.exception;

/**
 * Excepción personalizada para recursos no encontrados
 * Se lanza cuando no se encuentra una entidad en la base de datos
 */
public class ResourceNotFoundException extends RuntimeException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s no encontrado con %s: '%s'", resourceName, fieldName, fieldValue));
    }
}
