package com.restaurant.restaurant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Bean
    public WebClient webClient() {

        return WebClient.builder().baseUrl("http://localhost:8082").build();
    }

    @Bean
    public WebClient orderServiceWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:8084") // different URL
                .build();
    }
}
