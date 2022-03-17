package com.selcukmeral.websocket.config;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.ChannelInterceptor;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomChannelInterceptor implements ChannelInterceptor {

	@Override
	public Message<?> preSend(Message<?> message, MessageChannel channel) {
		log.debug("subscribe interceptor preSend message:"+message+"_channel:"+channel);
		return message;
	}
	
	@Override
	public void postSend(Message<?> message, MessageChannel channel, boolean sent) {
		log.debug("subscribe interceptor postSend message:"+message);
	}
}
