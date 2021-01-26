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
- https://developer.mozilla.org/ko/docs/Web/API/WebRTC_API/Protocols   

- https://wormwlrm.github.io/2021/01/24/Introducing-WebRTC.html  
- http://www.kyobobook.co.kr/product/detailViewKor.laf?ejkGb=KOR&mallGb=KOR&barcode=9788960777934&OV_REFFER=http://click.linkprice.com/   
- https://medium.com/@hyun.sang/webrtc-webrtc%EB%9E%80-43df68cbe511  
- https://blog.sessionstack.com/how-javascript-works-webrtc-and-the-mechanics-of-peer-to-peer-connectivity-87cc56c1d0ab   

> 크로스브라우징 라이브러리    
https://github.com/webrtcHacks/adapter  

> NAT, NAT 트래버셜(NAT traversal)?  
https://ko.wikipedia.org/wiki/%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC_%EC%A3%BC%EC%86%8C_%EB%B3%80%ED%99%98   
https://en.wikipedia.org/wiki/NAT_traversal    

> DHCP?  
https://en.wikipedia.org/wiki/Dynamic_Host_Configuration_Protocol   

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
  
- 피어 연결  
피어 연결은 피어 투 피어 프로토콜을 사용하여 통신하기 위해 서로 다른 컴퓨터에있는 두 응용 프로그램을 연결하는 WebRTC 사양의 일부  
  
- WebRTC는 기본적으로 네트워크 연결시 SSL이 있어야 한다.  
  
- TURN 서버  
https://webrtc.org/getting-started/turn-server?hl=ko  
  
WebRTC는 개인간 연결(Peer to Peer)을 기본으로 하기 때문에  
실행되는 단말기(PC, 휴대폰등)가 공인 IP를 가지거나, 같은 네트워크(공유기) 안에서 서로 인식 할 수 있어야 한다.  
하나는 공유기 안에 있고, 다른 하나는 공유기 밖에 있다면 통신을 할 수 없다.  
  
이 경우 각 단말기는 공인 IP를 가진 서버(Server)를 경유해서 통신해야 하고,  
TURN(CoTURN, Traversal Using Relays around NAT) 서버는 WebRTC 가 이렇게 통신할 수 있도록 중계 서버 역할을 해주는 오픈 소스 프로그램이다.  
(공인IP를 가진 서버에 설치)  
https://github.com/coturn/coturn  
https://coturn.net/turnserver/  
http://www.omegaduck.com/2019/08/12/sturn-turn-%EC%84%9C%EB%B2%84-%EA%B5%AC%EC%84%B1/  

TURN 방식은 네트워크 미디어를 중개하는 서버를 이용하는 것입니다.  
TURN 방식은 중간에 서버를 한 번 거치기 때문에, 엄밀히 이야기하자면 P2P 통신이 아니게 되며 그 구조 상 지연이 필연적으로 발생하게 됩니다.  
하지만 보안 정책이 엄격한 개인 NAT 내부에 위치한 브라우저와 P2P 통신을 할 수 있는 유일한 방법이기 때문에, TURN 방식은 최후의 수단으로 선택되어야 합니다.  

- STURN 서버  
STUN(Session Traversal Utilities for NAT) 서버는 인터넷의 복잡한 주소들 속에서 유일하게 자기 자신을 식별할 수 있는 정보를 반환해줍니다.  
즉, WebRTC 연결을 시작하기 전에 STUN 서버를 향해 요청을 보내면, STUN 서버는 NAT 뒤에 있는 피어(Peer)들이 서로 연결할 수 있도록 공인 IP와 포트를 찾아줍니다.

-----
  
### 설치 

> libevent2 모듈 설치 참고(CentOS 6)  
```
$ yum install -y libevent2.x86_64 libevent2-devel.x86_64
$ wget https://coturn.net/turnserver/v4.5.1.3/turnserver-4.5.1.3.tar.gz
$ tar xvf turnserver-4.5.1.3.tar.gz 
$ cd turnserver-4.5.1.3
$ ./configure 
$ make install
```

> 설명
```
$ cat /usr/local/share/doc/turnserver/postinstall.txt
```

> 가이드 참고
```
$ man turnserver
$ man turnadmin
$ man turnutils
```

> 경로 참고
```
/usr/local/share/turnserver
/usr/local/share/doc/turnserver
/usr/local/share/examples/turnserver
```

> 환경설정
```
/etc/turnserver.conf
/var/db/turndb
/usr/local/var/db/turndb
/var/lib/turn/turndb
/usr/local/etc/turnserver.conf
```

----------

- turnserver.conf
> 설정을 하기 전에 포트포워딩 또는 방화벽을 통해 tcp 3478 & tcp 5349 포트를 허용  
```conf
# turnserver의 포트입니다.
listening-port=3478
# tls 포트입니다.
tls-listening-port=5349
# 외부IP를 넣어줍니다.(공유기 사용시 WAN상의 외부IP를 넣어줍니다.)
external-ip=123.123.126.123
# 로그를 뽑을 수 있으니 주석을 해제하였습니다.
verbose
# 이것도 주석해제
fingerprint
# 인증방식 주석해제
lt-cred-mech
# turnserver 도메인 네임입니다.
server-name=test.com
# 릴름은 원하는 네임명으로 해줍니다.
realm=testname
```

- turnadmin 을 통해 turnserver를 사용할 수 있는 계정을 생성  
```
$ turnadmin -a -u 계정이름 -p 계정패스워드 -r 릴름명  
```

- turnserver 실행  
```
$ sudo service coturn start  
```

- log
`/var/log/turn_14545_<날짜>.log` 형태로 로그가 쌓임  

----------

```
$ turnutils_uclient -t -u 계정 -w 비밀번호 공인IP
```

