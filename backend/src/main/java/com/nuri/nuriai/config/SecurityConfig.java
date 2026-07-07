package com.nuri.nuriai.config;

import com.nuri.nuriai.repository.UserRepository;
import com.nuri.nuriai.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.security.Key;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private Key secretKey;

    @Autowired
    private UserRepository userRepository;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    // [추가] CORS 설정 빈 등록
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000")); // 프론트엔드 주소 허용
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // 쿠키나 Authorization 헤더 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            // [추가] CORS 설정 적용
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                    // H2 콘솔 접근 허용
                    .requestMatchers("/h2-console/**").permitAll()
                    .requestMatchers("/api/users/login", "/api/users/join").permitAll()
                    .requestMatchers("/api/users/userId/**", "/api/users/userNickname/**").permitAll()

                    .requestMatchers("/api/mypage", "/api/inquiries", "/api/inquiries/**").authenticated()
                    .requestMatchers("/api/plans/**", "/api/users/me").authenticated()
                    .anyRequest().authenticated()
            )
            .addFilterBefore(new JwtAuthenticationFilter(secretKey, userRepository), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}