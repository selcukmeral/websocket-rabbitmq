package com.selcukmeral.websocket.model;

import lombok.Data;

@Data
public class MessageModel {

	private MessageType type;
	private Object messageData;
	private String username;
	private String sessionId;
	private DestinationModel destination;
	
	public enum MessageType {
		CHAT,JOIN, LEAVE,DISCONNECT
	}
}
