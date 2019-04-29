---
title: 'Javascript Object property의 속성'
date: "2018-10-16"
layout: "post"
draft: false
path: "/posts/6"
category: "Javascript 기초"
tags:
  - "Javascript"
---

### 개요
자바스크립트의 객체는 개별적인 값으로 property를 내포하는데, 이 property들은 각각의 설정값들을 지닌다.<br>
이 속성에 정의에 따라 property의 쓰임이 달라진다. 함께 알아보도록 하자.

### Property's Description
객체의 프로퍼티는 각각의 설정값을 지니는데, 원어로 표현하면 기술(description)이라 한다. 여기서는 알아보기 쉽게 설정으로 표현하겠다. 일반 설정과 데이터 접근 설정으로 나뉜다.

#### 공통
- **configurable**: 설정 재조정과 프로퍼티 삭제 여부 / 기본값 false
- **enumerable**: 열거 여부 (in Object.keys(), or for-in statement) / 기본값 false

#### 일반 설정자
- **value**: 프로퍼티의 값 / 기본값 undefined
- **writable**: true일 경우 값을 할당할 수 있다. / 기본값 false

#### 접근 설정자 (Getter, Setter)
- **get**: 속성값을 얻는 함수이다. 즉 해당 속성의 값을 리턴한다. / 기본값 undefined
- **set**: 속성값을 설정하는 함수이다. 인자는 value하나만 올 수 있다. / 기본값 undefined

### Object.defineProperty(), 공통, 일반 설정자
Object 생성자의 static 메소드인 definedProperty는 이러한 객체의 설정들을 세부적으로 조정할 수 있도록 돕는다.<br>
용법은 다음과 같다.
```javascript
Object.defineProperty(obj, prop, descriptor)
```
첫번째 인자인 obj는 메소드의 대상이 되는 객체이다. 두번째 인자 prop은 설정할 프로퍼티의 이름이며, 마지막 인자 descriptor에서 이 설정들을 객체의 형태로 조정한다. 이를테면, 다음과 같다.

```javascript
const obj = {};
Object.defineProperty(obj, 'foo', {
  __proto__: null,
  value: 'bar'
  writable: true
});

console.log(obj)
```
value, writable외의 기타 설정이 없으므로 모두 default설정으로 들어간다. 즉 configurable, enumerable 속성이 모두 false인 것이다. 다음을 확인해보면 알 수 있다.

```javascript
obj.foo = 1; 
console.log(obj) // 안 바뀜, writable 불가

Object.defineProperty(obj, 'foo', {
  __proto__: null,
  value: 'foobar',
}); // CANNOT REDEFINE PROPERTY 에러, configurable이 false이기 때문

Object.defineProperty(obj, 'foo', {
  writable: false;
}); // 단, writable 값만은 configurable == false 라도, 오직 false 로는 바뀔 수 있다

for(let i in obj) {
  console.log(i) 
}

Object.keys(obj)

// 둘 다 빈값으로 나옴, enumerable이 false이기 때문

```

그렇다면 객체 리터럴로 생성한 프로퍼티의 경우는 어떨까?
```javascript
const obj2 = {
  foo: 'this is writable, enumerable, and configurable!!'
}

obj2.foo = 'is this writable, enumerable, and configurable ?'
console.log(obj2.foo)
// writable!!

for (let i in obj2) {
  console.log(i)
}

console.log(Object.keys(obj2))
// enumerable!

Object.defineProperty(obj2, 'foo', {
  value: '...'
}) // configurable !!
```

재선언, 열거, 재설정이 모두 가능하다. 즉 객체 리터럴로 생성한 프로퍼티는 다음과 같다.
```javascript
const obj2 = {
  foo: 'bar'
}

// 는 다음과 같다.

Object.defineProperty(obj2, 'foo', {
  value: 'bar',
  writable: true,
  enumerable: true,
  configurable: true
})
```

객체 리터럴보다 Object.defineProperty가 강력한 점은 이러한 설정들을 디테일하게 관리할 수 있다는 것이다.

### 접근 설정자
접근 설정자는 getter, setter를 의미한다. 일반적으로 사용하는 getter, setter함수는 이 속성의 축약형이다.<br>
접근 설정자는 writable속성이나, value 속성과 같은, value를 다루는 속성과는 함께 쓰일수 없다. 즉 다음과 같은 코드는 에러가 난다.

```javascript
const obj3 = {}
let temp = 0;
Object.defineProperty(obj3, 'foo', {
  value: 0,
  writable: true,
  get (){
    return temp;
  }
});
// TypeError: Invalid property descriptor. 
// Cannot both specify accessors and a value or writable attribute
```
getter나 setter는 다음 형태로도 사용이 가능하다
```javascript
function Archiver() {
  let temp = null;
  const archive = [];

  Object.defineProperty(this, 'temp', {
    get() {
      console.log('get!');
      return temp;
    },
    set(value) {
      temp = value;
      archive.push({ val: temp });
    }
  });

  this.getArchive = () => archive;
}

const arc = new Archiver();
arc.temp = 'temp1';
arc.temp = 'temp2';

arc.getArchive();
```
위의 예에서 볼 수 있듯 getter나 setter를 사용하면 사용자가 객체를 추가하거나, 변경할 때 임의의 설정이 가능하다.<br>
이러한 특성을 이용해 옵저버 패턴을 만들 수 있고, 옵저버 패턴을 이용해 React, Vue와 같은 프레임워크에서는 Reactivity, 즉 반응성을 정의한다.

[Vue의 반응성을 어떻게 정의하는지에 대한 글](http://vuejs.kr/jekyll/update/2017/01/21/how-vue-add-observer-getter-setter/)도 함께 보면 좋을 것 같다.

