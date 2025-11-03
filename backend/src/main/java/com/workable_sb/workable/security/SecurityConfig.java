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
            
            // Aspirante endpoints
            .requestMatchers(HttpMethod.POST, "/api/aspirante").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/aspirante/**").permitAll()
            .requestMatchers("/api/administradores/**").hasRole("ADMINISTRADOR")
            .requestMatchers("/api/hojasdevida/**").hasRole("ASPIRANTE")

            // Usuario endpoints
            .requestMatchers(HttpMethod.GET, "/api/usuarios").hasRole("ADMIN")
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
