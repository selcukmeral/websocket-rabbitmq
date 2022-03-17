package com.selcukmeral.websocket.config;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import com.selcukmeral.websocket.services.EventService;

import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final EventService eventService;
    
    @EventListener
    public void handleWebSocketConnectedListener(SessionConnectedEvent event) {
        eventService.connectWebSocket(event);
    }
    
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
    	
    	eventService.disconnectWebSocket(event);
    }
    
    @EventListener
    public void handleWebSocketSubscribeListener(SessionSubscribeEvent event) {
    	eventService.subscribeWebSocket(event);
    }
    
    @EventListener
    public void handleWebSocketUnsubscribeListener(SessionUnsubscribeEvent event) {
    	eventService.unsubscribeWebSocket(event);
    }

   
}
