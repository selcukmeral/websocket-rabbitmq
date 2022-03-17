
package com.selcukmeral.websocket.services;

import java.security.Principal;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import com.selcukmeral.websocket.model.MessageModel;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

	private final SimpMessageSendingOperations messagingTemplate;
	
	
	public MessageModel sendMessage(MessageModel chatMessage,SimpMessageHeaderAccessor headerAccessor,Principal user) {
		String sessionId = headerAccessor.getSessionId();
		chatMessage.setUsername(sessionId);
		chatMessage.setSessionId(sessionId);
		messagingTemplate.convertAndSend(chatMessage.getDestination().getTargetDestination(), chatMessage);
		log.debug(sessionId+"_"+chatMessage.getDestination().getTargetDestination()+"_send message to Queue. message content:"+chatMessage.getMessageData());
		return chatMessage;
	}

}
