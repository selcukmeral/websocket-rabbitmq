package com.selcukmeral.websocket.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocket
@EnableWebSocketMessageBroker
public class WebSocketMessageBrokerConfig implements WebSocketMessageBrokerConfigurer {

	@Value("${rabbitmq.host}")
	public String RABBIT_HOST;

	@Value("${rabbitmq.relay-port}")
	Integer RABBIT_PORT;

	@Value("${rabbitmq.v-host}")
	public String RABBIT_V_HOST;

	@Value("${rabbitmq.username}")
	public String RABBIT_USERNAME;

	@Value("${rabbitmq.passcode}")
	public String RABBIT_PASSCODE;

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.setApplicationDestinationPrefixes("/websocket-app");
		registry.enableStompBrokerRelay("/topic/")
				.setRelayHost(RABBIT_HOST) // broker
				.setRelayPort(RABBIT_PORT) // broker port
				.setVirtualHost(RABBIT_V_HOST)
				.setClientLogin(RABBIT_USERNAME)
				.setClientPasscode(RABBIT_PASSCODE)
				.setSystemLogin(RABBIT_USERNAME)
				.setSystemPasscode(RABBIT_PASSCODE);
	}
	
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/websocket-server")
		.addInterceptors(new HttpHandshakeInterceptor())
		.setAllowedOrigins("http://localhost:8080")
		.withSockJS();
	}

	@Override
	public void configureClientInboundChannel(ChannelRegistration registration) {
		registration.interceptors(new CustomChannelInterceptor());
	}
	
	@Bean
    public WebMvcConfigurer forwardToIndex() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
            	registry.addMapping("/**")
				.allowedOrigins("http://localhost:8080"
					).allowedMethods("GET", "POST", "PUT", "DELETE").allowedHeaders("*");
	        }
        };
    }
}
