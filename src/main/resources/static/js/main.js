

$(document).ready(function () {
	var usernamePage = document.querySelector('#username-page');
	var chatPage = document.querySelector('#chat-page');
	var usernameForm = document.querySelector('#usernameForm');
	var title = document.querySelector('#title');
	var messageForm = document.querySelector('#messageForm');
	var messageInput = document.querySelector('#message');
	var messageArea = document.querySelector('#messageArea');
	var userStatusArea = document.querySelector('#userStatusArea');
	var connectingElement = document.querySelector('.connecting');
	var colors = [
	    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
	    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
	];
	var websocketServer = new WebSocketServer();
	var userList = [];

	function connect(event) {
		websocketServer.connect(onConnected, onError);
		usernamePage.classList.add('hidden');
		chatPage.classList.remove('hidden');
	    event.preventDefault();
	}

	 
	function onConnected(result) {
		var sessionId = websocketServer.getSessionId();
	  
		// Subscribe to the Public Topic
	    websocketServer.subscribeRoom('/topic/rooms.public',onSubscribeRoomMessageReceived,null);
	    
	    
	    var textElement = document.createElement('p');
	    var usernameText = document.createTextNode('Session Id:'+sessionId);
	    textElement.appendChild(usernameText);

	    title.appendChild(textElement);
	    
	    connectingElement.classList.add('hidden');
	}


	function onError(error) {
	    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
	    connectingElement.style.color = 'red';

	}


	function sendMessage(event) {
		
	    var messageContent = messageInput.value.trim();
	    if(messageContent) {
	    	var destination = {
	    			targetDestination:'/topic/rooms.public'
	    	}
	    	websocketServer.sendMessage(destination,'CHAT',messageInput.value);
	        messageInput.value = '';
	    }
	    event.preventDefault();
	}
	
	function generateUserStatusArea(userListData){
		if(userListData){
			var userStatusElement = document.createElement('li');
			userListData.forEach(function(user) {
				  console.log(user);
				  userStatusElement.classList.add('status-message');
				2
				  var messageData = 'Session Id:'+user.sessionId + 'is online' ;
				 
				  var textElement = document.createElement('p');
				  var messageText = document.createTextNode(messageData);
				  textElement.appendChild(messageText);
				  
				  userStatusElement.appendChild(textElement);	
			
			});
			while (userStatusArea.firstChild) {
				userStatusArea.removeChild(userStatusArea.firstChild);
			}
			userStatusArea.appendChild(userStatusElement);
		}
	}
	

	function onSubscribeRoomMessageReceived(payload) {
	    var message = JSON.parse(payload.body);
	    var destination = message.destination;
	    var joinSubscribe = null;
	    if(destination){
			joinSubscribe = destination.targetDestination;
	    }
	    var messageElement = document.createElement('li');

	    //subscribe callbak. user bir odaya subscribe olursa subscribe oldugu odalara bildirim gelir
	    if(message.type === 'JOIN') {
	        messageElement.classList.add('event-message');
	        message.messageData = 'User JOIN! Session Id:'+message.sessionId +' Destination:'+ joinSubscribe;
	       
	        if(userList){
	        	var userBean = {
	        			username:message.username,
	        			sessionId:message.sessionId
	        	}
	        	userList.push(userBean);
				generateUserStatusArea(userList);
	        }
	        
	    } 
	    //unsubscribe callbak. user bir odadan unsubscribe olursa subscribe oldugu odalara bildirim gelir
	    else if (message.type === 'LEAVE') {
	        messageElement.classList.add('event-message');
	        message.messageData = 'User LEAVE! Session Id:'+message.sessionId +' Destination:'+ joinSubscribe;
	        
	        if(userList){	        	
	        	for(var i = 0; i < userList.length; i++){ 
        		   if ( userList[i].username === message.username) {
        			   userList.splice(i, 1); 
        		   }
	        	}
				generateUserStatusArea(userList);
	        }
	    } 
	  //disconnect callbak. user disconnect olursa subscribe oldugu odalara bildirim gelir
	    else if (message.type === 'DISCONNECT') {
	        messageElement.classList.add('event-message');
	        message.messageData = 'User DISCONNECT! Session Id:'+message.sessionId +' Destination:'+ joinSubscribe;
	        if(userList){	        	
	        	for(var i = 0; i < userList.length; i++){ 
        		   if ( userList[i].username === message.username) {
        			   userList.splice(i, 1); 
        		   }
	        	}
				generateUserStatusArea(userList);
	        }
	    } 
	    //Chat message callback.subscribe olunan odaya mesaj gelince calisan callback
	    else if (message.type === 'CHAT') {
	        messageElement.classList.add('chat-message');

	        var avatarElement = document.createElement('i');
	        var avatarText = document.createTextNode(message.username);
	        avatarElement.appendChild(avatarText);
	        avatarElement.style['background-color'] = getAvatarColor(message.username);

	        messageElement.appendChild(avatarElement);

	        var usernameElement = document.createElement('span');
	        var usernameText = document.createTextNode(message.username);
	        usernameElement.appendChild(usernameText);
	        messageElement.appendChild(usernameElement);
	    }

	    var textElement = document.createElement('p');
	    var messageText = document.createTextNode(message.messageData);
	    textElement.appendChild(messageText);

	    messageElement.appendChild(textElement);

	    messageArea.appendChild(messageElement);
	}


	function getAvatarColor(messageSender) {
	    var hash = 0;
	    for (var i = 0; i < messageSender.length; i++) {
	        hash = 31 * hash + messageSender.charCodeAt(i);
	    }
	    var index = Math.abs(hash % colors.length);
	    return colors[index];
	}

	usernameForm.addEventListener('submit', connect, true)
	messageForm.addEventListener('submit', sendMessage, true)
});