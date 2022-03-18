"use strict";
function WebSocketServer() {
	var socket = null;
	var activeWebRtcSessions = {};
    var subscriptionList = {};
    var stompClient = null;
	return {
		connect : function(connectCallback,errorCallback) {
	        var endpoint = 'http://localhost:8080/websocket-server';
	        socket = new SockJS(endpoint);
	        stompClient = Stomp.over(socket);
	        
	        var headers = {};
	        stompClient.connect(headers, connectCallback, errorCallback);	

		},
		getSessionId: function(){
			 if(stompClient) {
				 var url = stompClient.ws._transport.url;
				 url = url.replace("ws://localhost:8080/websocket-server/",  "");
				 url = url.replace("/websocket", "");
				 url = url.replace(/^[0-9]+\//, "");
				 console.log("Your current session is: " + url);
				 return url;
			 }
			       
		},
		forceDisconnect: function(socketDisconnectedListenerCallback,headers){
			stompClient.disconnect(socketDisconnectedListenerCallback, headers);
		},
		subscribeRoom : function(room, onJoinRoomMessageReceived, headers) {
			var subscription = stompClient.subscribe(room, onJoinRoomMessageReceived,headers);
			subscriptionList[room] = subscription;
		},
		leaveRoom : function(room) {
			if(subscriptionList[room]){
				subscription = subscriptionList[room];
				subscription.unsubscribe();
			}
		},
		sendMessage : function(destination, msgType, msgData) {
			 if(stompClient) {
			        var msgDataJson = {
			            messageData: msgData,
			            type: msgType,
			            destination: destination
			        };
			        var headers = {};
			        stompClient.send('/websocket-app/chat.sendMessage', headers, JSON.stringify(msgDataJson));
			    }
		},
		sendEmit:function(callName,data){
			if(stompClient) {
		        var msgDataJson = {
		        	messageData: data.msgData,
		            type: data.msgType,
		            destination:data.destination
		        };
		        var headers = {};
		        stompClient.send(callName, headers, JSON.stringify(msgDataJson));
		    }
	    },
	};
}