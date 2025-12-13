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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Configuración principal de seguridad de Spring Security.
 * Define reglas de acceso, CORS, autenticación JWT y manejo de sesiones.
 */
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    private final JwtFilter jwtFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(JwtFilter jwtFilter, 
                        JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
                        CustomUserDetailsService customUserDetailsService) {
        this.jwtFilter = jwtFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.customUserDetailsService = customUserDetailsService;
        log.info("SecurityConfig inicializado");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("Configurando cadena de filtros de seguridad");
        
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
            )
            .authorizeHttpRequests(auth -> auth
                // ===== RUTAS PÚBLICAS =====
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/health").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                
                // ===== ADMIN - ACCESO TOTAL A TODO (DEBE IR PRIMERO) =====
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Búsqueda pública de empresas, ofertas, municipios y habilidades
                .requestMatchers(HttpMethod.GET, "/api/empresa/publicas").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/empresa/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/oferta/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/municipio/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/habilidades/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/habilidades").permitAll()

                // ===== USUARIO - Gestión de perfiles =====
                .requestMatchers(HttpMethod.POST, "/api/usuario/public").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/usuario/public/**").hasAnyRole("ASPIRANTE", "RECLUTADOR", "ADMIN", "ADSO")
                .requestMatchers(HttpMethod.PUT, "/api/usuario/public/**").hasAnyRole("ASPIRANTE", "RECLUTADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/usuario/public/**").hasAnyRole("ASPIRANTE", "RECLUTADOR")
                .requestMatchers("/api/usuario/**").hasRole("ADMIN")

                // ===== ASPIRANTE, ADMINISTRADOR, RECLUTADOR =====
                .requestMatchers("/api/aspirante/**").authenticated()
                .requestMatchers("/api/administrador/**").authenticated()
                .requestMatchers("/api/reclutador/**").authenticated()

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

                // ===== POSTULACIONES =====
                .requestMatchers(HttpMethod.POST, "/api/postulacion").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.GET, "/api/postulacion/verificar").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/postulacion/mis-postulaciones").hasRole("ASPIRANTE")
                .requestMatchers(HttpMethod.GET, "/api/postulacion/**").hasAnyRole("ADMIN", "ASPIRANTE", "RECLUTADOR")
                .requestMatchers(HttpMethod.PUT, "/api/postulacion/**").hasAnyRole("ADMIN", "RECLUTADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/postulacion/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // ===== ESTUDIO - ASPIRANTES Y ADMIN =====
                .requestMatchers(HttpMethod.GET, "/api/estudio/**").hasAnyRole("ADMIN", "ASPIRANTE", "RECLUTADOR")
                .requestMatchers(HttpMethod.POST, "/api/estudio").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.PUT, "/api/estudio/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.DELETE, "/api/estudio/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // ===== EXPERIENCIA - ASPIRANTES Y ADMIN =====
                .requestMatchers(HttpMethod.GET, "/api/experiencia/**").hasAnyRole("ADMIN", "ASPIRANTE", "RECLUTADOR")
                .requestMatchers(HttpMethod.POST, "/api/experiencia").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.PUT, "/api/experiencia/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.PATCH, "/api/experiencia/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.DELETE, "/api/experiencia/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // ===== USUARIO-HABILIDAD - ASPIRANTES Y ADMIN =====
                .requestMatchers(HttpMethod.GET, "/api/usuario-habilidad/**").hasAnyRole("ADMIN", "ASPIRANTE", "RECLUTADOR")
                .requestMatchers(HttpMethod.POST, "/api/usuario-habilidad").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.PUT, "/api/usuario-habilidad/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.DELETE, "/api/usuario-habilidad/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // ===== HOJA DE VIDA - ASPIRANTES =====
                .requestMatchers(HttpMethod.GET, "/api/hoja-vida/publicas/**").hasAnyRole("ADMIN", "RECLUTADOR")
                .requestMatchers(HttpMethod.GET, "/api/hoja-vida/**").hasAnyRole("ADMIN", "ASPIRANTE", "RECLUTADOR")
                .requestMatchers(HttpMethod.POST, "/api/hoja-vida").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.PUT, "/api/hoja-vida/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.PATCH, "/api/hoja-vida/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.DELETE, "/api/hoja-vida/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // ===== HABILIDADES - GESTIÓN ADMIN =====
                .requestMatchers(HttpMethod.POST, "/api/habilidades").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/habilidades/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/habilidades/**").hasRole("ADMIN")

                // ===== NOTIFICACIONES - USUARIOS AUTENTICADOS =====
                .requestMatchers("/api/notificacion/**").authenticated()

                // ===== FEEDBACK - ASPIRANTES =====
                .requestMatchers("/api/feedback/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // ===== CITACIÓN - RECLUTADORES Y ADMIN =====
                .requestMatchers("/api/citacion/**").hasAnyRole("ADMIN", "RECLUTADOR", "ASPIRANTE")

                // ===== CUALQUIER OTRA RUTA - REQUIERE AUTENTICACIÓN =====
                .anyRequest().authenticated()
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        
        log.info("Configuración de seguridad completada");
        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173", 
            "http://localhost:8080",
            "http://localhost:3000",
            "http://localhost:789",
            "http://127.0.0.1:5173"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
