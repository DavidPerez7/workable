package com.workable_sb.workable.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
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

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    // definir filtros de acceso
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            // Allow CORS preflight globally
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            
            // Empresa endpoints
            .requestMatchers(HttpMethod.GET, "/api/empresa/**").permitAll()  // GETs públicos
            .requestMatchers(HttpMethod.POST, "/api/empresa").hasRole("RECLUTADOR")  // POST solo reclutador
            .requestMatchers(HttpMethod.PUT, "/api/empresa/**").hasRole("RECLUTADOR")  // PUT solo reclutador
            .requestMatchers(HttpMethod.DELETE, "/api/empresa/**").hasRole("RECLUTADOR")  // DELETE solo reclutador
            
            // Oferta endpoints
            .requestMatchers(HttpMethod.GET, "/api/oferta/**").permitAll()  // GETs públicos
            .requestMatchers(HttpMethod.POST, "/api/oferta").hasRole("RECLUTADOR")  // POST solo reclutador
            .requestMatchers(HttpMethod.PUT, "/api/oferta/**").hasRole("RECLUTADOR")  // PUT solo reclutador
            .requestMatchers(HttpMethod.DELETE, "/api/oferta/**").hasRole("RECLUTADOR")  // DELETE solo reclutador
            
            // endpoints de Aspirante
            .requestMatchers(HttpMethod.POST, "/api/aspirante").hasRole("ADMIN") //solo puede crear el administrador
            .requestMatchers(HttpMethod.GET, "/api/aspirante/**").permitAll()
            .requestMatchers("/api/administradores/**").hasRole("ADMINISTRADOR")
            .requestMatchers("/api/hojasdevida/**").hasRole("ASPIRANTE")

            //endpoints reclutador
            .requestMatchers(HttpMethod.POST, "/api/reclutador").hasAnyRole("ADMIN", "RECLUTADOR")
            .requestMatchers(HttpMethod.GET, "/api/reclutador").hasRole("ADMIN")
            .requestMatchers(HttpMethod.GET, "/api/reclutador/empresa/**").hasAnyRole("ADMIN", "RECLUTADOR")

            // Usuario endpoints
            .requestMatchers(HttpMethod.GET, "/api/usuario").hasRole("ADMIN")
            .requestMatchers(HttpMethod.POST, "/api/usuario").hasRole("ADMIN")
            
            //admin endpoints
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            
            // Modalidad endpoints
            .requestMatchers(HttpMethod.GET, "/api/modalidad", "/api/modalidad/", "/api/modalidad/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/modalidad", "/api/modalidad/").hasAnyRole("ADMIN", "RECLUTADOR")
            .requestMatchers(HttpMethod.PUT, "/api/modalidad/**").hasAnyRole("ADMIN", "RECLUTADOR")
            .requestMatchers(HttpMethod.DELETE, "/api/modalidad/**").hasAnyRole("ADMIN", "RECLUTADOR")
            .requestMatchers(HttpMethod.PATCH, "/api/modalidad/**").hasAnyRole("ADMIN", "RECLUTADOR")
            
            // TipoContrato endpoints
            .requestMatchers(HttpMethod.GET, "/api/tipo-contrato", "/api/tipo-contrato/", "/api/tipo-contrato/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/tipo-contrato", "/api/tipo-contrato/").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PUT, "/api/tipo-contrato/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.DELETE, "/api/tipo-contrato/**").hasRole("ADMIN")
            .requestMatchers(HttpMethod.PATCH, "/api/tipo-contrato/**").hasRole("ADMIN")

            // Beneficio endpoints
            .requestMatchers(HttpMethod.GET, "/api/beneficio", "/api/beneficio/", "/api/beneficio/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/beneficio", "/api/beneficio/").hasAnyRole("ADMIN", "RECLUTADOR")
            .requestMatchers(HttpMethod.PUT, "/api/beneficio/**").hasAnyRole("ADMIN", "RECLUTADOR")
            .requestMatchers(HttpMethod.DELETE, "/api/beneficio/**").hasAnyRole("ADMIN", "RECLUTADOR")
            .requestMatchers(HttpMethod.PATCH, "/api/beneficio/**").hasAnyRole("ADMIN", "RECLUTADOR")
            
            .anyRequest().authenticated()
            ).sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // definir configuracion CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:8080"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

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
