package com.workable_sb.workable.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * Servicio para envío de correos electrónicos.
 * Reemplaza la funcionalidad anterior de WhatsApp con notificaciones por email.
 */
@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@workable.com}")
    private String fromEmail;

    @Value("${app.name:Workable}")
    private String appName;

    /**
     * Envía un correo de citación a un candidato
     */
    public void enviarCitacionEmail(String destinatario, String nombreCandidato, String nombreOferta,
                                     String fecha, String hora, String linkMeet,
                                     String nombreReclutador, String detalles) {
        if (mailSender == null) {
            // Si no hay servicio de mail configurado, solo logueamos
            System.out.println("[EMAIL] Servicio de mail no configurado. Citación para: " + destinatario);
            return;
        }

        String asunto = "📅 Citación para entrevista - " + nombreOferta;
        String contenidoHtml = construirEmailCitacion(nombreCandidato, nombreOferta, fecha, hora, 
                                                       linkMeet, nombreReclutador, detalles);
        
        enviarEmail(destinatario, asunto, contenidoHtml);
    }

    /**
     * Envía un correo de notificación general
     */
    public void enviarNotificacion(String destinatario, String asunto, String mensaje) {
        if (mailSender == null) {
            System.out.println("[EMAIL] Servicio de mail no configurado. Notificación para: " + destinatario);
            return;
        }

        String contenidoHtml = construirEmailNotificacion(asunto, mensaje);
        enviarEmail(destinatario, asunto, contenidoHtml);
    }

    /**
     * Envía un correo de bienvenida al registrarse
     */
    public void enviarBienvenida(String destinatario, String nombreUsuario) {
        if (mailSender == null) {
            System.out.println("[EMAIL] Servicio de mail no configurado. Bienvenida para: " + destinatario);
            return;
        }

        String asunto = "🎉 ¡Bienvenido a " + appName + "!";
        String contenidoHtml = construirEmailBienvenida(nombreUsuario);
        
        enviarEmail(destinatario, asunto, contenidoHtml);
    }

    /**
     * Envía un correo de confirmación de postulación
     */
    public void enviarConfirmacionPostulacion(String destinatario, String nombreCandidato, 
                                               String nombreOferta, String nombreEmpresa) {
        if (mailSender == null) {
            System.out.println("[EMAIL] Servicio de mail no configurado. Confirmación para: " + destinatario);
            return;
        }

        String asunto = "✅ Postulación recibida - " + nombreOferta;
        String contenidoHtml = construirEmailConfirmacionPostulacion(nombreCandidato, nombreOferta, nombreEmpresa);
        
        enviarEmail(destinatario, asunto, contenidoHtml);
    }

    /**
     * Envía un correo de cambio de estado en postulación
     */
    public void enviarCambioEstado(String destinatario, String nombreCandidato, 
                                    String nombreOferta, String nuevoEstado) {
        if (mailSender == null) {
            System.out.println("[EMAIL] Servicio de mail no configurado. Cambio estado para: " + destinatario);
            return;
        }

        String asunto = "📋 Actualización de tu postulación - " + nombreOferta;
        String contenidoHtml = construirEmailCambioEstado(nombreCandidato, nombreOferta, nuevoEstado);
        
        enviarEmail(destinatario, asunto, contenidoHtml);
    }

    // ========== MÉTODOS PRIVADOS ==========

    private void enviarEmail(String destinatario, String asunto, String contenidoHtml) {
        try {
            MimeMessage mensaje = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(contenidoHtml, true);
            
            mailSender.send(mensaje);
            System.out.println("[EMAIL] Correo enviado exitosamente a: " + destinatario);
            
        } catch (MessagingException e) {
            System.err.println("[EMAIL] Error al enviar correo a " + destinatario + ": " + e.getMessage());
            throw new RuntimeException("Error al enviar correo: " + e.getMessage());
        }
    }

    private String construirEmailCitacion(String nombreCandidato, String nombreOferta, String fecha,
                                           String hora, String linkMeet, String nombreReclutador, 
                                           String detalles) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4A90D9; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                    .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4A90D9; }
                    .btn { display: inline-block; background-color: #4A90D9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                    .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📅 Citación para Entrevista</h1>
                    </div>
                    <div class="content">
                        <p>Hola <strong>%s</strong>,</p>
                        <p>Has sido citado/a para una entrevista para el puesto de <strong>%s</strong>.</p>
                        
                        <div class="info-box">
                            <p><strong>📆 Fecha:</strong> %s</p>
                            <p><strong>🕐 Hora:</strong> %s</p>
                            <p><strong>👤 Reclutador:</strong> %s</p>
                            %s
                        </div>
                        
                        %s
                        
                        <p>¡Te deseamos mucho éxito!</p>
                    </div>
                    <div class="footer">
                        <p>Este correo fue enviado por %s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                nombreCandidato,
                nombreOferta,
                fecha,
                hora,
                nombreReclutador,
                detalles != null && !detalles.isBlank() ? "<p><strong>📝 Detalles:</strong> " + detalles + "</p>" : "",
                linkMeet != null && !linkMeet.isBlank() ? "<a href=\"" + linkMeet + "\" class=\"btn\">🔗 Unirse a la reunión</a>" : "",
                appName
            );
    }

    private String construirEmailNotificacion(String titulo, String mensaje) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4A90D9; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                    .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔔 %s</h1>
                    </div>
                    <div class="content">
                        <p>%s</p>
                    </div>
                    <div class="footer">
                        <p>Este correo fue enviado por %s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(titulo, mensaje, appName);
    }

    private String construirEmailBienvenida(String nombreUsuario) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                    .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 ¡Bienvenido a %s!</h1>
                    </div>
                    <div class="content">
                        <p>Hola <strong>%s</strong>,</p>
                        <p>¡Gracias por registrarte en nuestra plataforma!</p>
                        <p>Ahora puedes:</p>
                        <ul>
                            <li>Explorar ofertas de empleo</li>
                            <li>Completar tu hoja de vida</li>
                            <li>Postularte a las ofertas que te interesen</li>
                        </ul>
                        <p>¡Te deseamos mucho éxito en tu búsqueda laboral!</p>
                    </div>
                    <div class="footer">
                        <p>Este correo fue enviado por %s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(appName, nombreUsuario, appName);
    }

    private String construirEmailConfirmacionPostulacion(String nombreCandidato, String nombreOferta, 
                                                          String nombreEmpresa) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #17a2b8; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                    .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #17a2b8; }
                    .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Postulación Recibida</h1>
                    </div>
                    <div class="content">
                        <p>Hola <strong>%s</strong>,</p>
                        <p>Tu postulación ha sido recibida exitosamente.</p>
                        
                        <div class="info-box">
                            <p><strong>📋 Oferta:</strong> %s</p>
                            <p><strong>🏢 Empresa:</strong> %s</p>
                        </div>
                        
                        <p>El equipo de reclutamiento revisará tu perfil y te contactará pronto.</p>
                        <p>¡Gracias por tu interés!</p>
                    </div>
                    <div class="footer">
                        <p>Este correo fue enviado por %s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(nombreCandidato, nombreOferta, nombreEmpresa, appName);
    }

    private String construirEmailCambioEstado(String nombreCandidato, String nombreOferta, String nuevoEstado) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #ffc107; color: #333; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                    .status { display: inline-block; background-color: #4A90D9; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; }
                    .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📋 Actualización de Postulación</h1>
                    </div>
                    <div class="content">
                        <p>Hola <strong>%s</strong>,</p>
                        <p>Tu postulación para <strong>%s</strong> ha sido actualizada.</p>
                        
                        <p>Nuevo estado: <span class="status">%s</span></p>
                        
                        <p>Revisa la plataforma para más detalles.</p>
                    </div>
                    <div class="footer">
                        <p>Este correo fue enviado por %s</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(nombreCandidato, nombreOferta, nuevoEstado, appName);
    }
}
