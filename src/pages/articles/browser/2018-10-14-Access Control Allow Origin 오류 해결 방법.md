---
title: 'Access Control Allow Origin 오류 해결 방법'
date: "2018-10-14"
layout: "post"
draft: false
path: "/posts/5"
category: "Web 기초"
tags:
  - "Node js"
  - "Javascript"
  - "Web"
---

### 개요
웹 환경에서 몇몇 리소스들은 Same Origin Policy를 따른다. 이것은 보안과 관련된 것으로, 만일 내 도메인의 민감한 리소스를 다른 도메인에서 마음껏 접근할 수 있다면 문제가 발생할 여지가 있다. 따라서 자바스크립트의 비동기 요청인 Ajax, 또는 css에서 다른 도메인의 font-face 요청 같은 경우, 원칙적으로 다른 도메인에서의 접근을 제한한다. 같은 도메인, 즉 동일 출처는 프로토콜(http, https), 도메인 호스트, 포트를 기준으로 판단한다.

이러한 다른 도메인으로 요청을 보냈을 때 콘솔에서 Access Control Allow Origin 오류를 발견할 수 있다. 주로 API 요청에서 나타나는 경우가 잦은데, 이는 CORS허용, postMessage, xdomainRequest, JSONP 등으로 우회할 수 있다.

### CORS 허용
REST API를 사용하는 경우, 데이터가 오가기 떄문에 일반적으로 도메인 호스트 **서버에서 CORS 허용**을 해주어야 한다. 악의적일 수도 있는 클라이언트를 방지하는 최소한의 안전장치다. CORS는 Cross-Origin Resource Sharing의 약자로, 서버로 하여금 cross origin(cross domain)에서의 데이터 자원 접근을 활성화하게 한다. 

서버는 요청에 대한 응답 헤더에 Access control 값을 설정해 줌으로써 다른 도메인에서의 접근을 활성화한다. 

```
Access-Control-Allow-Origin: "*"
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS;
Access-Control-Allow-Headers: Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, CORELATION_ID;
Access-Control-Max-Age: 3600;
Access-Control-Allow-Credentials: true || false
```

- **Access-Control-Allow-Origin**: CORS를 허용할 도메인. 모든 도메인에 대해 허용하려면 * 를 적어주고, 아니면 http://example.com 과 같이 특정 도메인을 적어준다.
- **Access-Control-Allow-Methods**: CORS 를 허용할 메서드 화이트 리스트이다.
- **Access-Control-Allow-Headers**: preflight(사전 요청)에 이은 실제 요청에서 적용될 수 있는 헤더의 화이트리스트. 즉 이 요청이 어떤 요청인지를 판별한다 (ex / Form, Ajax, etc)
- **Access-Control-Max-Age**: preflight(사전 요청) 의 결과값 캐시 시간이다. 단위는 초 단위. 즉 설정한 시간만큼 더 이상 preflight를 보내지 않는다.
- **Access-Control-Allow-Credentials**: Request의 withCredentials헤더가 true일 경우에 응답을 반환할지에 대한 여부를 나타낸다. 주로 쿠키를 사용한 인증 관련 요청을 한다면 이 값을 true로 주어야 한다

여기에서 preflight는 다른 도메인에서의 요청이 안전한지를 판단하기 위해, 본 요청이 들어오기 전에 사전 요청을 보내는 것이다. OPTIONS라는 메서드로 전달된다. OPTIONS Request를 받은 서버는 Request의 메소드가 허용되는 메소드인지를 판별해서, 허용된다면 상태값 200을, 허용되지 않는다면 405를 반환한다.
단, 아래의 조합들은 "간단한 요청"으로 판별되므로 preflight를 보내지 않고 바로 본 요청을 보낸다.(Gecko 2.0 이상에서)

- METHOD: GET, HEAD, POST
- HEADER: Accept, Accept-Language, Content-Language, Content-Type
- Content Type: application/x-www-form-urlencoded, multipart/form-data, text/plain

서버와 REST형식으로 데이터를 주고받으려면 서버에서 위 값들을 쓰임에 맞게 설정해 주는것이 필요하다. Express의 경우를 살펴보면, 수동으로 설정해줄 수 있으나 cors라는 미들웨어를 사용해주면 간편하다.

```javascript
const express = require('express');
const server = express();
const cors = require('cors');

server.all('/*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*") 
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // 기타 헤더 설정
  next();
});

// or 

server.use((req, res, next) => { 
    res.header("Access-Control-Allow-Origin", "*") 
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); 
        return res.status(200).json({});
    }
    next();
})

// or use cors middleware, just like this

server.use(cors());

// with option

const corsOption = {
    origin: process.env.CORS_ORIGIN || '*', 
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ["Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"]
};

server.use(cors(corsOption))

```

### XDomainRequest

~~지옥의~~ IE 8, 9버전에서는 Ajax 요청의 표준인 XMLHttpRequest 를 통한 CORS를 지원하지 않는다. 대신에 XDomainRequest 객체를 통해 헤더 설정을 할 수 있는데, XMLHttpRequest와 인터페이스가 다르기 때문에 혼용할 수 없고 새로운 객체를 만들어야 한다. 

이 요소는 IE10에 남아 있다가 IE11에 와서야 비로소 depricated 되었다.

### postMessage 메소드

일반적으로 iframe, popup과의 통신에서 사용한다. 도메인이 다른경우에도 사용 가능하다<br>
IE8 이상에서는 window의 postMessgae 메소드를 이용할 수 있다. 용법은 다음과 같다
```javascript
targetWindow.postMessage(message, targetOrigin, [ transfer ]);
```
targetWindow는 메시지를 받을 목적지의 참조값이다. window.open() 으로 얻은 객체, iframe.contentWindow 객체 등이 들어갈 수 있다.

message는 보낼 메시지의 내용이다. string, object, array 등의 타입이 들어간다.

targetOrigin 에는 targetWindow의 호스트, 포트 등이 URL 형태의 string으로 들어간다. 즉 targetWindow의 주소이다.

마지막 transfer 매개변수는 옵션이며, transferable 한 값들을 메시지와 함께 전송할 수 있다. transferable 이란 다른 window나 worker로 전송할 수 있는 값이며, ArrayBuffer, ImageBitmap, MessagePort가 있다. 이를 전송하면 다른 윈도우에서 이 객체를 다시 생성하는것 보다 비용이 적게 들 수 있다고 한다.

message 를 받는 쪽에서는 받는 메시지에 대한 처리를 해주어야 한다. message 이벤트로 감지한다.
```javascript
window.addEventListener(‘message’, function (e) {
  if (e.origin !== "targetOrigin의 주소") {
    return;
  } else {
    e.source.postMessage('response', 'target')
  }
});
```
위의 코드에서 e.source는 이벤트(요청)를 발생시킨 객체의 참조값이다. 이같은 방식을 통해 request-response의 양방향 바인딩을 할 수 있다. 

단 크롬 익스텐션의 경우, source의 값은 항상 null이다.

### JSONP
JSONP는 JSON with Padding의 약자이며 일종의 편법이다. 즉 스펙에 정의된 프로토콜이나 데이터 유형이 아니다.<br>
방식은 다음과 같다
1. 데이터를 요청하는 클라이언트에는 데이터를 받아 처리할 콜백 함수를 선언한다. 매개변수는 데이터이다
2. 데이터를 반환하는 서버에서 콜백 함수를 실행하는 형태로 출력한다.
3. 클라이언트의 실제 실행부분은 script 태그를 임베딩하는 부분이다. 즉 스크립트 태그가 실행될 때 callback url을 넘겨 즉시 실행시킨 후 반환값을 클라이언트에서 받는 것이다.

```javascript
// client.html

const JSONP = data => {
  // data에 대한 처리
  console.log(data)
}

const script = document.createElement('script'); 
script.src = 'http://example.com/jsonp&callback=JSONP' 
document.getElementsByTagName('head')[0].appendChild(script);

// http://example.com/jsonp
JSONP('반환할 data')
```



한계는 다음과 같다
1. script태그를 이용하는 방식이므로 GET 메소드로밖에 접근할 수 없다.
2. 통신 실패를 명확히 감지하지 못한다.

### 기타 CORS우회 방법
개발 시 크롬을 사용한다면 CORS Allow 제한을 풀어주는 [익스텐션](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi)이 존재한다. 그러나 실 배포 시에는 반드시 서버에서 허용을 해주어야 한다.<br>
크롬 실행 시 --disable-web-security을 걸어주는 방법도 있으나 웬만해선 권장하지 않는다.