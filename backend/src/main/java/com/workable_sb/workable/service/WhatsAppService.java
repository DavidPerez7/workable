package com.workable_sb.workable.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class WhatsAppService {
    
    @Value("${whatsapp.api.url:https://graph.instagram.com/v18.0}")
    private String apiUrl;
    
    @Value("${whatsapp.phone.number.id}")
    private String phoneNumberId;
    
    @Value("${whatsapp.access.token}")
    private String accessToken;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    public void enviarCitacionWhatsApp(String numeroDestino, String nombreAspirante, 
                                       String nombreOferta, String fechaCitacion, 
                                       String horaCitacion, String linkMeet, 
                                       String nombreReclutador, String detalles) {
        try {
            // Construir mensaje de WhatsApp
            String mensaje = construirMensajeCitacion(nombreAspirante, nombreOferta, 
                                                      fechaCitacion, horaCitacion, 
                                                      linkMeet, nombreReclutador, detalles);
            
            // Enviar por WhatsApp
            enviarMensajeWhatsApp(numeroDestino, mensaje);
            
            log.info("Mensaje de citación enviado por WhatsApp a: " + numeroDestino);
            
        } catch (Exception e) {
            log.error("Error al enviar mensaje de WhatsApp: " + e.getMessage());
            throw new RuntimeException("Error al enviar mensaje de WhatsApp: " + e.getMessage());
        }
    }
    
    private void enviarMensajeWhatsApp(String numeroDestino, String mensaje) {
        try {
            String url = apiUrl + "/" + phoneNumberId + "/messages";
            
            // Construir payload
            Map<String, Object> payload = new HashMap<>();
            payload.put("messaging_product", "whatsapp");
            payload.put("recipient_type", "individual");
            payload.put("to", numeroDestino);
            payload.put("type", "text");
            
            Map<String, Object> text = new HashMap<>();
            text.put("body", mensaje);
            payload.put("text", text);
            
            // Configurar headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(accessToken);
            
            // Crear request
            HttpEntity<String> request = new HttpEntity<>(objectMapper.writeValueAsString(payload), headers);
            
            // Enviar
            var response = restTemplate.postForObject(url, request, Map.class);
            
            if (response != null && response.containsKey("messages")) {
                log.info("Mensaje enviado exitosamente por WhatsApp");
            } else {
                throw new RuntimeException("Respuesta inesperada de WhatsApp API");
            }
            
        } catch (Exception e) {
            log.error("Error en envío de WhatsApp: " + e.getMessage());
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
    
    private String construirMensajeCitacion(String nombreAspirante, String nombreOferta, 
                                           String fechaCitacion, String horaCitacion, 
                                           String linkMeet, String nombreReclutador, 
                                           String detalles) {
        
        StringBuilder mensaje = new StringBuilder();
        mensaje.append("🎯 *INVITACIÓN A ENTREVISTA* 🎯\n\n");
        mensaje.append("¡Hola ").append(nombreAspirante).append("!\n\n");
        
        mensaje.append("Nos complace invitarte a una entrevista para la posición de:\n");
        mensaje.append("*").append(nombreOferta).append("*\n\n");
        
        mensaje.append("📅 *Fecha:* ").append(fechaCitacion).append("\n");
        mensaje.append("🕐 *Hora:* ").append(horaCitacion).append("\n");
        mensaje.append("👤 *Entrevistador:* ").append(nombreReclutador).append("\n\n");
        
        mensaje.append("📹 *Enlace de Google Meet:*\n");
        mensaje.append(linkMeet).append("\n\n");
        
        if (detalles != null && !detalles.isEmpty()) {
            mensaje.append("📝 *Detalles:*\n");
            mensaje.append(detalles).append("\n\n");
        }
        
        mensaje.append("Por favor, asegúrate de tener acceso a una conexión a internet estable.\n");
        mensaje.append("Si tienes alguna pregunta, no dudes en comunicarte con nosotros.\n\n");
        
        mensaje.append("¡Esperamos verte pronto! 🚀");
        
        return mensaje.toString();
    }
}
