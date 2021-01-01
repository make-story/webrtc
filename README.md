# WebRTC (Web Real-Time Communication)
## https://github.com/googlecodelabs/webrtc-web   
## https://webrtc.github.io/samples/  
## https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices  

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
		// 화면 공유를 하려면 navigator.mediaDevices.getDisplayMedia() 사용합니다.  
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
- text, file, data, messaging, ...  
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
  
> 피어 연결  
피어 연결은 피어 투 피어 프로토콜을 사용하여 통신하기 위해 서로 다른 컴퓨터에있는 두 응용 프로그램을 연결하는 WebRTC 사양의 일부  
  
> WebRTC는 기본적으로 네트워크 연결시 SSL이 있어야 한다.  
  
> TURN 서버  
https://webrtc.org/getting-started/turn-server?hl=ko  
  
WebRTC는 개인간 연결(Peer to Peer)을 기본으로 하기 때문에  
실행되는 단말기(PC, 휴대폰등)가 공인 IP를 가지거나, 같은 네트워크(공유기) 안에서 서로 인식 할 수 있어야 한다.  
하나는 공유기 안에 있고, 다른 하나는 공유기 밖에 있다면 통신을 할 수 없다.  
  
이 경우 각 단말기는 공인 IP를 가진 서버(Server)를 경유해서 통신해야 하고,  
TURN(CoTURN, Traversal Using Relays around NAT)서버는 WebRTC 가 이렇게 통신할 수 있도록 중계 서버 역할을 해주는 오픈 소스 프로그램이다.  
(공인IP를 가진 서버에 설치)  
https://github.com/coturn/coturn  
https://coturn.net/turnserver/  
http://www.omegaduck.com/2019/08/12/sturn-turn-%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%84%B1/  

-----
  
> libevent2 모듈 설치 참고(CentOS 6)  
```
# yum install -y libevent2.x86_64 libevent2-devel.x86_64
```
