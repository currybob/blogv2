---
title: '[Algorithm] 괄호 쌍 만들기'
date: "2019-05-11T14:40:48.528Z"
layout: "post"
draft: false
path: "/posts/18"
category: "Algorithm"
tags:
  - "Algorithm"
  - "재귀"
  - "PS"
description: "주어진 수 대로 괄호 쌍을 만드는 문제를 해결합니다."
---

### 문제

괄호 쌍의 개수 n이 주어질 때, n개의 괄호 쌍으로 만들 수 있는 모든 가능한 괄호 문자열의 배열을 리턴하시오.

#### 입출력 예

| 입력 | 출력 |
|--|--|
| 2 | ["(())", "()()"] |
| 3 | [ '((()))', '(()())', '(())()', '()(())', '()()()' ] |

#### 풀이

재귀를 이용해 푼다. 각 쌍의 수는 매개변수 n과 일치할 것이므로, base case에서 괄호가 열리고 닫힌 횟수가 n과 일치할 때 완성한 괄호 문자열을 하나씩 넣어 준다.

나머지 재귀식에서는 괄호가 열리고 닫힐 때 문자열에 해당 상황에 맞는 괄호를 더해 준다.

```javascript
function solution(n) {
  const result = [];
  function makeBracket(open = 0, close = 0, bracket = ''){

    if (open < close) return;
    
    if (close === n) {
      result.push(bracket)
      return;
    }

    if (open < n) {
      makeBracket(open + 1, close, bracket + '(')
    }

    if (close < n) {
      makeBracket(open, close + 1, bracket + '(')
    }
  }

  makeBracket();

  return result;
}
```
