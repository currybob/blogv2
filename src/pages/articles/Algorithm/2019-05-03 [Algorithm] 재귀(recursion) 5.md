---
title: '[Algorithm] 재귀(recursion) 5'
date: "2019-05-03T19:37:48.528Z"
layout: "post"
draft: false
path: "/posts/17"
category: "Algorithm"
tags:
  - "Algorithm"
  - "재귀"
description: "멱집합(모든 부분집합) 문제에 대해 알아봅니다."
---

### 멱집합(Powerset)

- 임의의 집합 data의 모든 부분집합을 출력하라.
- 모든 가능한 갯수 찾기 문제

#### 예시

```
data = {a, b, c, d}

```

- 2개의 경우의 수 (true or false);
- 2^4 = 16개의 가능한 부분집합.

#### Recursive Thinking

{a,b,c,d,e,f} 의 모든 부분집합을 나열하려면, a를 제외한 **{b,c,d,e,f} 의 모든 부분집합**들을 나열한다.

즉 위 집합의 부분집합들은 a를 포함한 집합과 그렇지 않은 집합으로 나뉜다. 그렇지 않은 집합을 나열하고, 거기에 a를 추가한 집합을 나열해 주면 모든 부분집합을 나열할 수 있다.

즉, {b,c,d,e,f}의 모든 부분집합에 {a} 를 추가한 집합들을 나열한다.

조금 더 나가면?

- {c,d,e,f}의 모든 부분집합에 {a} 를 포함한 부분집합을 나열하고
- {c,d,e,f}의 모든 부분집합에 {a, b}를 추가한 집합들을 나열한다.

Mission: S의 멱집합을 출력해라

pseudo code:

```
powerSet(S)
if S is an empty set
	print nothing;
else
	let t be the first element of S;
	find all subsets of S-{t} by calling powerset(S-{t});
	print the subsets;
	print the subsets with adding t;

```

이렇게 하려면 powerset 함수는 여러 개의 집합들을 return 해야 한다.

즉 S가 N이라면 내부의 powerset은 2^N-1 의 부분집합을 리턴해 주어야 하는 것이다.

하지만 위의 코드에서는, 부분집합 내의 부분집합을 리턴해주지 않으므로 S-{t}의 부분집합을 구할 수 없다.

어떻게 해야 할까?

미션을 다시 설정해 다음과 같이 다시 짤 수 있다.

Mission: S의 멱집합을 구한 후 각각에 집합 P를 합집합하여 출력하라

Recursion 함수가 **두 개의 집합**을 매개변수로 받도록 설계해야 한다는 의미이다. 두 번째 집합의 모든 부분집합들에 첫번째 집합을 합집합하여 출력한다.


```
powerSet(P, S)
	if S is an empty set
		print P;
	else
		let t be the first elem of S;
		powerSet(P, S-{t}) // t를 포함하지 않는 부분집합
		powerSet(P U {t}, S-{t}) // t를 반드시 포함하는 부분집합

```

이는 다음과 같다

- {b,c,d,e,f}의 모든 부분집합에 {a}를 추가한 집합들을 나열하려면
- {c,d,e,f}의 모든 부분집합에 {a}를 추가한 집합들을 나열하고
- {c,d,e,f}의 모든 부분집합에 {a,b}를 추가한 집합들을 나열한다.

여기서 {c,d,e,f} 집합이 S집합이 되고, {a,b} 집합이 P집합이 된다.

집합 S는 k번째 인덱스부터 나머지 전체까지의 집합이다. 즉 k번째 인덱스를 알 수 있으면 집합 S를 알 수 있다.

집합 P는 반대로 처음부터 k-1번째 원소들 중 일부이다. (위의 예시의 경우, {a}혹은 {a,b} 가 될 수 있다.)

여기서, 다음과 같이 p의 원소들의 포함 여부를 결정하는boolean 배열을 만들어 P를 나타낼 수 있다.

```java
char[] data = {a,b,c,d,e,f,g,h,i,j,k,l}
boolean[] include = {true, false, true, true, false, false, ...}

char[] P = {a,c,d}

```

그러면 집합 S는 data[k], ..., data[n-1]이고, 집합 P는 include[i] = true, i=0,...k-1인 원소들이다.

그러면 실제 코드를 보자.

Mission: data[k], ..., data[n-1]의 멱집합을 구한 후, 각각에 incldue[i]=true, i=0, ..., k-1인 원소를 추가하여 출력하라.


```java
private static char data[] = {'a', 'b', 'c', 'd', 'e', 'f'};
private static int n = data.length;
private static boolean[] include = new boolean[n];

public static void powerSet(int k) {
	if (k==n) {
		for(int i=0; i<n; i++) {
			if (include[i]) System.out.print(data[i] + " ");
		}
		System.out.println();
		return;
	}
	
	include[k] = false;
	powerSet(k+1);
	include[k] = true;
	powerSet(k+1);
}
```

처음 이 함수를 호출할 때는 powerSet(0)으로 호출한다. 즉 P는 공집합이고 S는 전체집합이다.

base case는 집합 S가 공집합일 때, 즉 k가 n이 될 때이다.

그 다음 data[k]를 포함하지 않는 경우, 포함하는 경우 모두 재귀를 돌리면 된다.

#### 다른 접근법

저번 시간에 배운 상태공간트리로 이 문제를 풀 수 있다.

즉 루트에서 출발해 트리의 모든 노드들을 방문함으로써 해를 찾는 과정. DFS.

이러한 접근법으로 다시 위의 코드를 보자.

```java
private static char data[] = {'a', 'b', 'c', 'd', 'e', 'f'};
private static int n = data.length;
private static boolean[] include = new boolean[n]; 

public static void powerSet(int k) {
	if (k==n) {
		for(int i=0; i<n; i++) {
			if (include[i]) System.out.print(data[i] + " ");
		}
		System.out.println();
		return;
	}
	
	include[k] = false;
	powerSet(k+1);
	include[k] = true;
	powerSet(k+1);
}
```

- include와 k는 트리상에서 현재 나의 위치를 표현한다.
- k가 n이라는것은 현재 레벨이 리프 노드에 있다는 것을 의미한다. 마지막 레벨에서는 더 이상 탐색할 필요가 없으므로 리턴한다.
- include[k]가 true, false일 때 모두 탐색한다는 것은, 모든 노드를 다 탐색한다는 것을 의미한다.

출처: [권오흠 교수님 알고리즘 강좌](https://www.inflearn.com/course/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-%EA%B0%95%EC%A2%8C/dashboard)