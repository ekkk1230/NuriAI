package com.nuri.nuriai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher; // 💡 핵심 import
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. REST API 환경이므로 CSRF 무력화
                .csrf(csrf -> csrf.disable())

                // 2. 이중 프레임 구조인 H2 콘솔 정상 렌더링을 위한 설정
                .headers(headers -> headers
                        .frameOptions(frame -> frame.sameOrigin())
                )

                // 3. CORS 바인딩
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 4. 주소 매핑 오류를 방지하기 위해 AntPathRequestMatcher로 명시적 허용
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll() // h2 콘솔 뚫기
                        .requestMatchers(new AntPathRequestMatcher("/api/user/**")).permitAll()    // 로그인/회원가입 API 뚫기
                        .requestMatchers(new AntPathRequestMatcher("/**", "OPTIONS")).permitAll() // 프론트 OPTIONS 요청 뚫기
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}