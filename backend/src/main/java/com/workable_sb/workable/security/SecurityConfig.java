package com.workable_sb.workable.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configuración principal de seguridad de Spring Security.
 * Define reglas de acceso, CORS, autenticación JWT y manejo de sesiones.
 */
@Configuration
@EnableMethodSecurity(prePostEnabled = true) // Habilita @PreAuthorize y @PostAuthorize
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(JwtFilter jwtFilter, 
                         JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
                         CustomUserDetailsService customUserDetailsService) {
        this.jwtFilter = jwtFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.customUserDetailsService = customUserDetailsService;
    }

    // Configurar cadena de filtros de seguridad
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            )
            .authorizeHttpRequests(auth -> auth
                // ===== RUTAS PÚBLICAS =====
                // Autenticación (registro, login, refresh token)
                .requestMatchers("/api/auth/**").permitAll()
                
                // Preflight CORS
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // Búsqueda pública de empresas y ofertas
                .requestMatchers(HttpMethod.GET, "/api/empresa/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/oferta/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/aspirante/**").permitAll()

                // ===== ADMIN - ACCESO COMPLETO =====
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/usuario/**").hasRole("ADMIN")

                // ===== EMPRESA - SOLO RECLUTADORES Y ADMIN =====
                .requestMatchers(HttpMethod.POST, "/api/empresa").hasAnyRole("ADMIN", "RECLUTADOR")
                .requestMatchers(HttpMethod.PUT, "/api/empresa/**").hasAnyRole("ADMIN", "RECLUTADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/empresa/**").hasAnyRole("ADMIN", "RECLUTADOR")
                .requestMatchers(HttpMethod.PATCH, "/api/empresa/**").hasAnyRole("ADMIN", "RECLUTADOR")

                // ===== OFERTA - RECLUTADORES Y ADMIN =====
                .requestMatchers(HttpMethod.POST, "/api/oferta").hasAnyRole("ADMIN", "RECLUTADOR")
                .requestMatchers(HttpMethod.PUT, "/api/oferta/**").hasAnyRole("ADMIN", "RECLUTADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/oferta/**").hasAnyRole("ADMIN", "RECLUTADOR")
                .requestMatchers(HttpMethod.PATCH, "/api/oferta/**").hasAnyRole("ADMIN", "RECLUTADOR")

                // ===== POSTULACIONES - ASPIRANTES Y RECLUTADORES =====
                .requestMatchers(HttpMethod.POST, "/api/postulacion").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.GET, "/api/postulacion/**").hasAnyRole("ADMIN", "ASPIRANTE", "RECLUTADOR")
                .requestMatchers(HttpMethod.PUT, "/api/postulacion/**").hasAnyRole("ADMIN", "RECLUTADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/postulacion/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // ===== ESTUDIO - ASPIRANTES Y ADMIN =====
                .requestMatchers("/api/estudio/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers("/api/dataestudio/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // ===== EXPERIENCIA - ASPIRANTES Y ADMIN =====
                .requestMatchers("/api/experiencia/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers("/api/dataexperiencia/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // ===== HOJA DE VIDA - ASPIRANTES =====
                .requestMatchers("/api/hojasdevida/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // ===== RECLUTADOR ENDPOINTS =====
                .requestMatchers(HttpMethod.POST, "/api/reclutador").hasAnyRole("ADMIN", "RECLUTADOR")
                .requestMatchers(HttpMethod.GET, "/api/reclutador").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reclutador/empresa/**").hasAnyRole("ADMIN", "RECLUTADOR")

                // ===== NOTIFICACIONES - USUARIOS AUTENTICADOS =====
                .requestMatchers("/api/notificacion/**").authenticated()

                // ===== FEEDBACK - ASPIRANTES =====
                .requestMatchers("/api/feedback/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // ===== CUALQUIER OTRA RUTA - REQUIERE AUTENTICACIÓN =====
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Agregar filtro JWT antes del filtro de autenticación por usuario/contraseña
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    // Proveedor de autenticación que usa CustomUserDetailsService
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Configuración CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8080"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache preflight por 1 hora

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Encoder de contraseñas BCrypt
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Authentication Manager para login manual
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
