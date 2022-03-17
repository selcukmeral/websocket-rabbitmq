package com.selcukmeral.websocket.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.selcukmeral.websocket.model.MessageModel;
import com.selcukmeral.websocket.services.ChatService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {

	 
	 private final ChatService chatService;
	 
	@MessageMapping("/chat.sendMessage")
    public MessageModel sendMessage(@Payload MessageModel chatMessage,
    		SimpMessageHeaderAccessor headerAccessor,Principal user) {
        return chatService.sendMessage(chatMessage,headerAccessor,user);
    }

}
