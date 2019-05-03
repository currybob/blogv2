---
title: '[Algorithm] 재귀(recursion) 1'
date: "2019-05-02T12:40:48.528Z"
layout: "post"
draft: false
path: "/posts/13"
category: "Algorithm"
tags:
  - "Algorithm"
  - "재귀"
description: "재귀의 기본 개념과 재귀적 사고에 대해 학습합니다."
---

### Recursion

- 재귀함수, 자기 자신을 호출하는 함수.
- 일반적으로 호출하면 무한루프
- 적절한 경우에 리턴해주어야 한다.


#### 적절한 경우란 무엇인가?

- base case; 적어도 하나의 recursion에 빠지지 않는 경우가 존재해야 한다.
- recursion을 반복하다보면 결국 base case 로 수렴해야 한다

#### Recursion 의 해석

```java
public static int func(int n) {
	if (n == 0)
		return 0 // n === 0 이면 합은 0 이다.
	else 
		return n + func(n - 1)
} // 이 함수의 mission 은 0부터 n까지의 합을 구하는 것이다.
// n 이 0보다 크다면 0에서 n까지의 합은 0에서 n-1까지의 합에 n을 더한 것이다.
```

#### 수학적 귀납법에 의한 증명

정리: func(int n)은 음이 아닌 정수 n에 대해서 0에서 n까지의 합을 올바로 계산한다.

증명:

1. n = 0 인 경우: 0을 반환한다. 올바르다.
2. 임의의 양의 정수 k에 대해서 n<k인 경우, 0에서 n까지의 합을 올바르게 계산하여 반환한다고 가정하자.
3. n=k인 경우를 고려해보자. func은 먼저 func(k-1)을 호출하는데, 2번의 가정에 의해서 0에서 k-1까지의 합이 올바로 계산되어 반환된다. 메서드 func는 그 값에 n을 더해서 반환한다. 따라서 메서드 func은 0에서 k까지의 합을 올바로 계산하여 반환한다.

#### 다른 예제: Factorial
```java
public static int factorial(int n) {
	if (n == 0) return 1;
	
	return n * factorial(n - 1);
}
```

#### 다른 예제: X^n

```java
public static double power(double x, int n) {
	if (n == 0) return 1;
	
	return x * power(x, n - 1)
}
```

#### 피보나치: 황금비
```java
public int fibonacci(int n) {
	if (n < 2) return n;
	return fibonacci(n - 1) + fibonacci(n - 2)
}
```

#### 최대공약수: 유클리드 알고리즘

정의: m >= n인 두 양의 정수 m과 n에 대해 m이 n의 배수이면 gcd(m,n) = n 이고, 그렇지 않으면 gcd(m, n) = gcd(n, m % n) 이다.

```java
public static int gcd(int m, int n) {
	if (m < n) {
		int temp = m; m = n; n = temp;
	}
	
	if (m % n == 0) return n;
	return gcd(n, m % n);
}

```

다른 풀이법

```java
public static int gcd(int p, int q) {
	if (q == 0) return p;
	return gcd(q, p % q)
}
```


#### Recursive Thinking

- Recursion 은 수학함수 계산에만 유용한가? 
- 수학함수뿐 아니라 다른 많은 문제들을 recursion으로 해결할 수 있다.
- 분할 정복 알고리즘 가운데 하나.

#### 문자열의 길이 계산

문자열의 길이가 0이면 0 리턴
아니면, 가장 앞의 문자를 제외한 나머지 문자열의 길이에, 가장 앞의 문자열 길이를 더함.

#### 문자열을 뒤집어 프린트

- 문자열을 뒤집어 프린트 하려면
- 첫 글자를 제외한 나머지 글자를 뒤집어 프린트 한 후 
- 마지막으로 첫 글자를 프린트 한다.

#### 정수를 2진수로 변환하여 출력

- 음이 아닌 정수 n을 이진수로 변환하여 인쇄한다
- n을 2로 나눈 몫을 먼저 2진수로 변환하여 인쇄한 후 
- n을 2로 나눈 나머지를 인쇄한다.

#### 배열의 합

data[0] 에서 data[n - 1] 까지의 합을 구하여 반환한다.

```java
public static int sum(int n, int [] data) {
	if (n <= 0) return 0;
	
	return sum(n - 1, data) + data[n - 1];
}
```

#### 데이터파일로부터 n개의 정수 읽어오기

```java
public void readFrom(int n, int[] data, Scanner in) {
	if (n == 0) return; // base case
	readFrom(n - 1, data, in);
	data[n - 1] = in.nextInt();
}
```

#### Recursion vs Iteration

- 모든 재귀함수는 반복문(iteration)으로 변경 가능
- 그 역도 성립함. **즉 모든 반복문은 recursion으로 표현 가능함.**
- 순환함수는 복잡한 알고리즘을 단순하고 알기쉽게 표현하는 것을 가능하게 함.
- 하지만 함수 호출에 따른 오버헤드가 있음. (매개변수 전달, 액티베이션 프레임 생성 - 스택 메모리 차지 등)


#### Recursion의 설계

- 어떤 요령으로 recursion을 작성해야 하는가?
- 적어도 하나의 base case, 즉 순환되지 않고 종료되는 case 가 있어야 함.
- 모든 case 는 결국 base case 로 수렴해야 함.
- 암시적인 코드를 명시적으로 바꾸어라.

```java
int search(int[] data, int n, int target) {

	for (int i=0; i<n; i++)
		if (data[i] == target) return i;
		
	return -1;
}
```

위 코드는 인덱스가 0부터 시작한다고 암시적으로 표현된 코드이다. 이를 명시적으로 바꾸어 더 명확하게 한다.

즉, 아래와 같이 매개변수의 명시화가 필요.

```java
int search(int[] data, int begin, int end, int target) {
	if (begin > end) 
		return -1; // base case
	else if (target === data[begin]) 
		return begin;
	else 
		return search(data, begin + 1, end, target)
}
```

다른 버전

```java
int search(int[] data, int begin, int end, int target) {
	if (begin > end) return -1;
	
	int middle = (begin + end) / 2;
	if (data[middle] == target) return middle;
	int index = search(data, begin, middle - 1, target);
	
	if (index != -1) return index;
	return search(data, middle + 1, end, target);
}
```

이는 binary search 와는 다름.

#### 최대값 찾기

```java
int findMax(int[] data, int begin, int end) {
	if (begin == end) return data[begin];
	
	return Math.max(data[begin], findMax(data, begin + 1, end));
}
```

다른 버전

```java
int findMax(int[] data, int begin, int end) {
	if (begin == end) return data[begin];
	
	int middle = (begin + end) / 2;
	int max1 = findMax(data, begin, middle);
	int max2 = findMax(data, middle + 1, end);
	
	return Math.max(max1, max2);
}
```

#### 위치 찾기: 이진 검색

- 기본적으로 크기 순으로 정렬되어 있을 때, 이진검색을 활용할 수 있다.

```java
public static int binarySearch(String[] items, String target, int begin, int end) {
	if (begin > end) return  -1;
	
	int middle = (begin + end) / 2;
	int compResult = target.compareTo(items[middle]);
	
	if (compResult == 0) return middle;
	
	else if (compResult < 0) 
		return binarySearch(items, target, begin, middle - 1);
		
	else 
		return binarySearch(items, target, middle + 1, end);
}
```

출처: [권오흠 교수님 알고리즘 강좌](https://www.inflearn.com/course/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-%EA%B0%95%EC%A2%8C/dashboard)