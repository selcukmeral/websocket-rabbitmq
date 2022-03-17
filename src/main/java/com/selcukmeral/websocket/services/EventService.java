package com.selcukmeral.websocket.services;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;
import org.springframework.web.socket.messaging.SessionUnsubscribeEvent;

import com.selcukmeral.websocket.model.DestinationModel;
import com.selcukmeral.websocket.model.MessageModel;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

	private final SimpMessageSendingOperations messagingTemplate;
	
	
	public void connectWebSocket(SessionConnectedEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
				String sessionId = (String) headerAccessor.getSessionId();
		log.debug(sessionId + "_New web socket connection");
	}

	public void disconnectWebSocket(SessionDisconnectEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		String sessionId = (String) headerAccessor.getSessionId();
		log.debug(sessionId + "_User Disconnected");
	}

	public void subscribeWebSocket(SessionSubscribeEvent event) {
		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
		String sessionId = headerAccessor.getSessionId();
		String destination = headerAccessor.getDestination();
		log.debug(sessionId +  "_" + destination + "_Subscribe");
		
		//odadakilere subscribe mesajı iletilir
		DestinationModel destinationModel =  new DestinationModel();
		destinationModel.setTargetDestination(destination);
		
		MessageModel message = new MessageModel();
		message.setType(MessageModel.MessageType.JOIN);
		message.setUsername(sessionId);
		message.setSessionId(sessionId);
		message.setDestination(destinationModel);
		messagingTemplate.convertAndSend(destination, message);
		log.debug(sessionId + "_" + destination + "_send subscribe message");
		
	}

	public void unsubscribeWebSocket(SessionUnsubscribeEvent event) {

		SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());
		String sessionId = headerAccessor.getSessionId();
		String destination = headerAccessor.getDestination();
	
		log.debug(sessionId + "_" + destination + "_unsubscribe");

		//odadakilere unsubscribe oldugu bilgisi iletilir
		DestinationModel destinationModel =  new DestinationModel();
		destinationModel.setTargetDestination(destination);
		
		MessageModel message = new MessageModel();
		message.setType(MessageModel.MessageType.LEAVE);
		message.setUsername(sessionId);
		message.setSessionId(sessionId);
		message.setDestination(destinationModel);
		messagingTemplate.convertAndSend(destination, message);
		log.debug(sessionId + "_" + destination + "_send unsubscribe message");
	}

}