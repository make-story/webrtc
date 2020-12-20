# WebRTC (Web Real-Time Communication)
## https://github.com/googlecodelabs/webrtc-web   
## https://webrtc.github.io/samples/  

> 참고페이지 
- https://webrtc.org/?hl=ko  
- https://github.com/googlecodelabs/webrtc-web  
- https://webrtc.github.io/samples/  
- https://codelabs.developers.google.com/codelabs/webrtc-web/#0  
- https://developer.mozilla.org/ko/docs/Web/API/WebRTC_API  
- https://developer.mozilla.org/en-US/docs/Glossary/WebRTC  

----------

# WebRTC 주요 구성
> getUserMedia()  
장치의 카메라 또는 마이크에 대한 액세스를 허용하고 신호를 RTC에 연결  
```javascript 
async function getMedia(constraints=null) {
	let stream = null;

	try {
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		/* use the stream */
	}catch(err) {
		/* handle the error */
	}

	return stream;
}
function setVideo(stream) {
	const video = document.querySelector('video');

	video.srcObject = stream;
	video.onloadedmetadata = function(e) {
		video.play();
	};
}
```

> RTCPeerConnection  
영상 또는 음성 통화를 구성하는 인터페이스  
```javascript
function getPeerConnection(configuration=null) {
	const peer = new RTCPeerConnection(configuration);
	return peer;
}
```

> RTCDataChannel  
브라우저간에 피어-투-피어 데이터 경로를 설정하는 방법을 제공  
```javascript
function getDataChannel(peerConnection=null, channel="my channel") {
	const dataChanel = peerConnection.createDataChannel(channel);
	return dataChanel;
}
```

----------

```javascript
(async () => {
	const constraints = { 
		audio: true, 
		video: { 
			width: 1280, 
			height: 720 
		} 
	};
	const configuration = null;
	const stream = await getMedia(constraints);
	const peerConnection = getPeerConnection(configuration);
	const dataChanel = getDataChannel(peerConnection, "my channel");

	setVideo(stream);
	peerConnection.addStream(stream);
	dataChanel.onmessage = function(event) {
		console.log("received: " + event.data);
	};
	dataChanel.onopen = function() {
		console.log("datachannel open");
	};
	dataChanel.onclose = function() {
		console.log("datachannel close");
	};
})();
```

----------

> 카메라 및 마이크의 경우 navigator.mediaDevices.getUserMedia() 를 사용하여 MediaStreams 를 캡처합니다.  
> 화면 녹화를 위해 대신 navigator.mediaDevices.getDisplayMedia() 사용합니다.  
```javascript
// getUserMedia() 를 호출하면 사용자에게 권한 요청  
const constraints = {
	'video': true,
	'audio': true
};
navigator.mediaDevices.getUserMedia(constraints)
.then(stream => {
	console.log('Got MediaStream:', stream);
})
.catch(error => {
	console.error('Error accessing media devices.', error);
});
```
  
> 피어 연결  
피어 연결은 피어 투 피어 프로토콜을 사용하여 통신하기 위해 서로 다른 컴퓨터에있는 두 응용 프로그램을 연결하는 WebRTC 사양의 일부  
  
> WebRTC는 기본적으로 네트워크 연결시 SSL이 있어야 한다.  
  
> TURN 서버  
https://webrtc.org/getting-started/turn-server?hl=ko  
  
WebRTC는 개인간 연결(Peer to Peer)을 기본으로 하기 때문에  
실행되는 단말기(PC, 휴대폰등)가 공인 IP를 가지거나 같은 네트워크(공유기) 안에서 서로 인식 할 수 있어야 한다.  
하나는 공유기 안에 있고, 다른 하나는 공유기 밖에 있다면 통신을 할 수 없다.  
즉, 앞서서 정리한 화상채팅용 WebRTC 예제는 같은 공유기 내에서만 실행된다.  
  
이 경우 각 단말기는 공인 IP를 가진 서버(Server)를 경유해서 통신해야 하고,  
coturn서버는 WebRTC가 이렇게 통신할 수 있도록 중계 서버 역할을 해주는 오픈 소스 프로그램이다.  
(이런 서버를 Turn 서버라고 한다. Turn / Stun의 개념은 인터넷으로 쉽게 찾을 수 있다.)  
