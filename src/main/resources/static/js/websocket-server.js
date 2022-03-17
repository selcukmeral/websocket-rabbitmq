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
		joinSpecificUserRoom : function(sessionId, onSpecificUserMessageReceived, headers) {
			var subscription = stompClient.subscribe('/topic/specificUser.'+ sessionId, onSpecificUserMessageReceived,headers);
			subscriptionList['/topic/specificUser.'+ sessionId] = subscription;
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
		getRoomOccupantsAsArray : function(room) {
			 if(stompClient) {
			        var subscribeDataJson = {
			            subscribe: room
			        };
			        var headers = {};
			        stompClient.send('/websocket-app/subscribe.getUserInSubscribe', headers, JSON.stringify(subscribeDataJson));
			    }
		},
		getRoomOccupantsByName : function(room, username, cb) {
			 if(stompClient) {
			        var subscribeDataJson = {
			            subscribe: room,
			            username: username
			            
			        };
			        var headers = {};
			        stompClient.send('/websocket-app/subscribe.getSessionListInSubscribeByUsername', headers, JSON.stringify(subscribeDataJson));
			    }
		},
		getRoomsJoined: function (cb) {
			if(stompClient) {
		        stompClient.send('/websocket-app/subscribe.getSubscribeList');
		    }
        },
		generateRoomName : function(name1, name2) {
			var sortList = [ name1, name2 ];
			sortList = sortList.sort();
			var tempRoomname = sortList.toString();
			return tempRoomname.replace(",", "");
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
		callUser : function(isInitiator, targetSessionId, updateVideoView) {

			var config = {
				isInitiator : isInitiator,
				turn : {
					host : 'turn:allianzturnuser@85.159.72.80:3478',
					username : 'allianzturnuser',
					password : 'Turn2016*'
				// host: 'turn:admin@40.76.7.207:3478',
				// username: 'admin',
				// password: '123456'
				// host:
				// 'turn:ec2-54-68-238-149.us-west-2.compute.amazonaws.com:3478',
				// username: 'test',
				// password: 'test'
				// host:'stun:stun.l.google.com:19302',
				// username:'',
				// password:''

				},
				streams : {
					audio : true,
					video : true
				}
			};

			var session = new cordova.plugins.ortusrtc.Session(config);

			session.on('sendMessage', function(data) {
				/*
				 * signaling.emit('sendMessage', contactName, { type:
				 * 'ortusrtc_handshake', data: JSON.stringify(data) });
				 */
				 if(stompClient) {
					 	var destination =  {
			                    "targerSessionId": targetSessionId
		                }
				        var msgDataJson = {
				        	messageData: data,
				            type: "WEBRTC_HANDSHAKE",
				            destination: destination
				        };
				        var headers = {};
				        stompClient.send('/websocket-app/chat.sendMessage', headers, JSON.stringify(msgDataJson));
				 }

			});

			session.on('answer', function() {
				console.log('Answered!');
			});

			session.on('disconnect', function() {
				if (activeWebRtcSessions[targetSessionId]) {
					delete activeWebRtcSessions[targetSessionId];
					sessionStorage.setItem('activeWebRtcSessions', JSON
							.stringify(activeWebRtcSessions));
				}
				updateVideoView();
				/*
				 * if (Object.keys($scope.contacts).length === 0) {
				 * signaling.emit('sendMessage', contactName, { type: 'ignore'
				 * }); $state.go('app.contacts'); }
				 */
			});

			session.call();

			activeWebRtcSessions[targetSessionId] = session;
			sessionStorage.setItem('activeWebRtcSessions', JSON
					.stringify(activeWebRtcSessions));
		},
		endCall : function(targetSessionId) {
			if (activeWebRtcSessions[targetSessionId])
				activeWebRtcSessions[targetSessionId].close();
		},
       renegotiate : function(targetSessionId) {
			if (activeWebRtcSessions[targetSessionId])
				activeWebRtcSessions[targetSessionId].renegotiate();
		}
	};
}