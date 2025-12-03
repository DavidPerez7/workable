package com.workable_sb.workable.security;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
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
                // Rutas públicas de autenticación
                .requestMatchers("/api/auth/**").permitAll()
                
                // Permitir preflight CORS globalmente
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // DataExperiencia endpoints
                .requestMatchers(HttpMethod.GET, "/api/dataexperiencia/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.POST, "/api/dataexperiencia").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.PUT, "/api/dataexperiencia/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.PATCH, "/api/dataexperiencia/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.DELETE, "/api/dataexperiencia/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // DataEstudio endpoints
                .requestMatchers(HttpMethod.GET, "/api/dataestudio/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.POST, "/api/dataestudio").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.PUT, "/api/dataestudio/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.DELETE, "/api/dataestudio/**").hasAnyRole("ADMIN", "ASPIRANTE")

                // Empresa endpoints
                .requestMatchers(HttpMethod.GET, "/api/empresa/**").permitAll()  // GETs públicos
                .requestMatchers(HttpMethod.POST, "/api/empresa").hasRole("RECLUTADOR")  // POST solo reclutador
                .requestMatchers(HttpMethod.PUT, "/api/empresa/**").hasRole("RECLUTADOR")  // PUT solo reclutador
                .requestMatchers(HttpMethod.DELETE, "/api/empresa/**").hasRole("RECLUTADOR")  // DELETE solo reclutador

                // Oferta endpoints
                .requestMatchers(HttpMethod.GET, "/api/oferta/**").permitAll()  // GETs públicos
                .requestMatchers(HttpMethod.POST, "/api/oferta").hasAnyRole("ADMIN", "RECLUTADOR")  // POST admin o reclutador
                .requestMatchers(HttpMethod.PUT, "/api/oferta/**").hasAnyRole("ADMIN", "RECLUTADOR")  // PUT admin o reclutador
                .requestMatchers(HttpMethod.DELETE, "/api/oferta/**").hasAnyRole("ADMIN", "RECLUTADOR")  // DELETE admin o reclutador
                .requestMatchers(HttpMethod.PATCH, "/api/oferta/**").hasAnyRole("ADMIN", "RECLUTADOR")  // PATCH admin o reclutador

                // endpoints de Aspirante
                .requestMatchers(HttpMethod.POST, "/api/aspirante").hasRole("ADMIN") //solo puede crear el administrador
                .requestMatchers(HttpMethod.GET, "/api/aspirante/**").permitAll()
                .requestMatchers("/api/administradores/**").hasRole("ADMINISTRADOR")
                .requestMatchers("/api/hojasdevida/**").hasRole("ASPIRANTE")

                //endpoints reclutador
                .requestMatchers(HttpMethod.POST, "/api/reclutador").hasAnyRole("ADMIN", "RECLUTADOR")
                .requestMatchers(HttpMethod.GET, "/api/reclutador").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/reclutador/empresa/**").hasAnyRole("ADMIN", "RECLUTADOR")

                // Usuario endpoints (solo accesibles por ADMIN)
                .requestMatchers("/api/usuario/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/usuario").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/usuario").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/usuario/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/usuario/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/usuario/**").hasRole("ADMIN")

                // DataEstudio endpoints
                .requestMatchers(HttpMethod.GET, "/api/dataestudio/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.POST, "/api/dataestudio").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.PUT, "/api/dataestudio/**").hasAnyRole("ADMIN", "ASPIRANTE")
                .requestMatchers(HttpMethod.DELETE, "/api/dataestudio/**").hasAnyRole("ADMIN", "ASPIRANTE")

                //admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // Cualquier otra petición requiere autenticación
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
