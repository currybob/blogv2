---
title: 'Javascript 2. - 클로저 (Closure)'
date: "2018-10-07"
layout: "post"
draft: false
path: "/posts/4"
category: "Javascript 기초"
tags:
  - "Javascript"
description: "실행 컨텍스트와 연관지어 클로저가 무엇이고 어디에 활용되는지 다룹니다."
---

### 개요
클로저는 비단 자바스크립트만의 개념은 아니다. 함수를 일급 시민(First Citizen)으로 취급하는 대부분의 언어에서 파생되는 개념이다.
일반적으로 함수형 프로그래밍에서 함수는 특정 요소에 종속적이면 안 되며, 구현하고자 하는 하나의 기능만을 반환해야 한다. 클로저는 이러한 함수를 어떤 특정 데이터와 결부시키고자 할 때 유용하다. 즉 클로저를 사용함으로써 함수의 순수성을 보장하는 것인데, 자바스크립트에서 특히 클로저가 강조되어왔던 이유는 함수 기반의 스코프를 가지고 있는 자바스크립트에서 private 한 값을 선언할 수 없기 때문이었다. 이 부분은 ES6 의 블록 기반 선언자인 let, const 나 Typescript 를 도입하면서 어느 정도 해결되고 있으나, 그렇다고 해도 클로저는 여전히 유용하며, 적절하게 사용하는 것이 중요하다. 클로저에 대해 모른다면, 여러분도 모르게 마구 선언해버린 클로저가 지금도 앱 어딘가에서 메모리를 잡아먹고 있을 지도 모른다.

### 기본 개념
지난 시간에 실행 컨텍스트와 스코프를 배웠다. 이에 관련해 클로저를 정의 내리자면, **외부함수의 스코프에 포함되어 있는 내부함수가, 해당 외부함수의 실행이 종료 된 이후에도 그 안의 Variable Object(VO)에 접근할 수 있는 것**을 말한다. 

언뜻 보면 굉장히 난해한 정의다. 하지만 우리는 실행 컨텍스트를 배웠으므로, 어렵지 않게 이해할 수 있다. 다음 코드를 보자.
```javascript
function outer(){
  var freeVal = 'this is ';
  
  function inner(text){
    return text ? freeVal + text : freeVal + 'inner Function';
  }

  return inner;
}

var func = outer();

func('closure')
```

이 코드의 실행 순서를 살펴보자. 

1. 먼저 글로벌 실행 컨텍스트가 scope chain을 저장하고, 함수 outer, 변수 func를 전역 컨텍스트의 VO(Variable Object)에 저장할 것이다. VO의 property, outer의 value로는 outer함수 객체가 저장될 것이고, func의 값은 일단 undefined로 초기화된다.  
2. 다음으로, 실행문이 돌면서, ```var func = outer()``` 부분에서 outer함수가 실행된다. 동시에 새로운 실행 컨텍스트가 열린다 (활성 객체)
3. outer 함수는 변수 freeVal, 함수 inner을 포함하고 있다. scope chain[0]에는 선언될 당시의 컨텍스트인 Global 객체가 있고, VO에는 freeVal, inner가 저장된다. 여기서 중요한 부분은, **inner 함수는 [[scopes]] 프로퍼티를 가지는데, 이는 outer의 scope chain이라는 것이다!**
4. inner 함수가 리턴되며, func에는 결국 inner함수가 저장된다. outer함수는 죽는다. (콜스택에서 outer의 실행 컨텍스트가 빠진다.)
5. func가 실행되며, inner함수의 실행 컨텍스트가 열린다.
6. 매개변수 text를 VO에 저장하고, return 값의 freeVal을 찾아보려 하니 없다. 따라서 자신의 스코프 체인을 거슬러 올라가며 찾는다.
7. [[scopes]][0]인 outer 함수의 VO에서 값을 찾는다.

분명 outer함수는 inner함수를 리턴하고 죽었다. (실행 컨텍스트에서 빠졌다.). 그런데 여전히 inner 함수는 outer함수의 VO에 저장되어 있는 값을 참조할 수 있다. **이게 바로 클로저이다.** 이 때의 freeVal 변수는 자유 변수라고 한다.

조금 더 명확히 말해서, inner함수가 outer함수의 VO를 참조하고 있는 한, **outer함수에 의해 생성된 활성 객체는 여전히 유효하다.** 때문에 클로저를 설명한 여러 글에서는 클로저를 죽어도 다시 되살아나는 좀비에 비유하며, 활성 객체가 메모리 상에 남아 있기 때문에, 때때로 무분별하게 메모리를 잡아먹는 괴물이 되는 것이다.

### 클로저 활용 예제
그렇다면 클로저는 어디에 쓰일까?

#### 1. 전역 네임스페이스 보호

```javascript
function outer(){
  var count = 0;
  return function(){
    return ++count; 
  };
}

var o = outer();
for (var i = 0; i<10; i++) {
  console.log(o());
}
```

위의 실행 예제에서, 클로저의 역할은 전역 네임스페이스를 보호하는 것이다. 그러나 outer만을 리턴했다면 outer가 실행 될 때마다 변수 count는 다시 0으로 초기화되었을 것이다. 클로저를 활용하여, 전역 네임스페이스를 해치지 않고, private 변수도 흉내낼 수 있는 기법이 가능하다.

#### 2. 프라이빗 메소드, 모듈 패턴

```javascript
var Counter = function() {
  var privateCount = 0;
  function changeCount(val) {
    privateCount += val;
  }
  return {
    increment: function() {
      changeCount(1);
    },
    decrement: function() {
      changeCount(-1);
    },
    value: function() {
      return privateCount;
    }
  };   
};
```

위의 카운터 예제를 조금 더 발전시켜 보자. 내부함수 changeCount 가 참조하고 있는 privateCount 가 있고, changeCount함수 역시 return되는 객체에서만 접근할 수 있는 클로저이다. 즉 couter 함수의 리턴 객체는 public 메소드를 가지고 있고, 이 public 메소드들이 참조하는 것은 private한 값인 privateCount, changeCount인 것이다.
이 함수로 생성된 객체는 모두 독립된 값을 참조한다. 즉 다음과 같은 기법이 가능하다.

```javascript
var counter1 = Counter();
var counter2 = Counter();
console.log(counter1.value()); /* 0 */
counter1.increment();
counter1.increment();
console.log(counter1.value()); /* 2 */
counter1.decrement();
console.log(counter1.value()); /* 1 */
console.log(counter2.value()); /* 0 */
```

counter1, counter2 객체는 각각 독립된 값을 가지므로, 독립된 모듈이며, 이런 기법을 정보 은닉 관점에서 캡슐화, 독립된 모듈 관점에서 모듈화라 한다.
