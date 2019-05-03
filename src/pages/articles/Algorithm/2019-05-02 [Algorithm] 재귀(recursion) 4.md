---
title: '[Algorithm] 재귀(recursion) 4'
date: "2019-05-02T18:57:48.528Z"
layout: "post"
draft: false
path: "/posts/16"
category: "Algorithm"
tags:
  - "Algorithm"
  - "재귀"
description: "N Queens problem을 해결합니다."
---

### N Queens Problem

- 체스 판을 생각해보자
- 같은 열, 행, 대각선 상에 중복되지 않게 N개의 말을 놓아라.

##### Back Traking

- 가장 최근에 내린 결정을 번복하는 과정
- 막다른 길에 도달했을 때, 가장 최근에 내린 결정을 번복해라.
- N개의 말을 모두 놓을 수 있는 위치를 찾았으면 그만둔다.

##### 상태공간트리

- 모든 가능한 해를 포함하는 트리
- 즉 해가 존재한다면, 그것은 반드시 이 트리의 어떤 한 노드에 해당함.
- 따라서 이 트리를 체계적으로 탐색하면 해를 구할 수 있음.


이는 일종의 깊이우선탐색이다.

recursion을 사용하는 방법과 stack을 사용하는 방법이 있는데, recursion을 사용하는 것이 비교적 명확하고 쉽다.

##### pseudo code

```
return-type queens(arguments) {
	if non-promising // 이미 꽝인 길
		report failure and return;
	else if success
		report answer and return;
	else
		visit children recursively;
}
```

함수에 어떤 매개변수를 넘겨주어야 할까?

현재 도착한(있는) 노드가 어떤 노드인지를 판별할 수 있는 정보가 주어져야 한다.

모든 위치정보를 매개변수로 넘겨주게 되면 매개변수의 수가 많아지게 된다.

따라서 다음과 같이 전역변수를 사용해 말이 위치한 열을 나타내준다.

```java
int[] cols = new int[N + 1];

return-type queens(int level):
	...
```

이렇게 되면 level번째 말은 이미 어디에 놓일지 정해진 것이 된다.

```java
cols[1] = 1번말이 놓인 열
cols[2] = 2번말이 놓인 열
...
cols[level] = level번째 말이 놓인 열
```

이렇게 구성하면 말이 어떤 위치에 놓였는지 파악 가능하다.

그렇다면 return type은 어떻게 할까?

일단 boolean으로 해 보자.

```java
boolean queens(int level){
	if(!promising(level)) return false;
	
	else if (level==N) 
		// level이 현재까지 놓인 말의 개수이기 때문에 N과 level이 같다면 모든 말이 놓인 것. 또한 promising test를 통과했기 때문에 말들끼리 충돌하지도 않는다.
		report true
	
	// recursive 하게 자식 노드를 탐색
	for(int i=1; i<=N; i++) {
		cols[level + 1] = i;
		if (queens(level + 1))
			return true;
	}
	
	return false;
}

// 처음에는 queens(0)으로 호출한다.

```

##### Promising Test는 어떻게 할까?

- 매개변수로 level 값을 받는다
- 이전에 놓인 말들은 앞의 로직에 의해, 서로 충돌이 없음이 보장되어 있다.
- 따라서 마지막에 놓인 말이 (cols[level]), 이전의 말들과 충돌하는지 검사하는 것으로 충분하다.

```java
boolean promising(int level) {
	for(int i=1; i<level; i++) {
		if (cols[i] == cols[level])
			// 같은 열에 놓였는지 검사
			return false;
		else if on the same diagonal
			// 같은 대각선에 놓였는지 검사
			return false;
		
	}
	return true;
}
```

대각선에 위치한 것은 어떻게 구할까?

```java
// 폴더 내 그림 참고

if (level - i == Math.abs(cols[level] - cols[i]);
	return false;
```

출처: [권오흠 교수님 알고리즘 강좌](https://www.inflearn.com/course/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-%EA%B0%95%EC%A2%8C/dashboard)