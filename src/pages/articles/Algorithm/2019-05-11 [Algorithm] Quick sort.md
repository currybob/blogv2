---
title: '[Algorithm] Quick sort'
date: "2019-05-11T16:40:48.528Z"
layout: "post"
draft: false
path: "/posts/19"
category: "Algorithm"
tags:
  - "Algorithm"
  - "정렬"
description: "분할정복법 중 하나인 퀵소트에 대해 알아봅니다."
---

### 개요

- 분할: Pivot을 정하고, 배열을 pivot보다 작은 부분, 큰 부분의 두 부분으로 나눈다
- 정복: 각 부분을 순환적으로 정렬한다.
- 합병: nothing to do

#### 순서

1. 정렬할 배열이 주어짐. 마지막 수를 Pivot으로 삼는다.

```
[31, 8, 48, 73, 11, 3, 20, 29, 65, 15]
PIVOT = 15
```

2. 기준보다 작은 수는 기준의 왼쪽에, 나머지는 오른쪽에 오도록 재배치(분할) 한다.

```
[8, 11, 3, 15(pivot), 31, 48, 20, 29, 65, 73];
```

3. 기준의 왼쪽과 오른쪽을 각각 순환적으로 정렬한다.

```
[3, 8, 11, 15, 20, 29, 31, 48, 65, 73]
```

#### 어떻게 정렬할 것인가?

p부터 r까지의 배열 A가 있다고 치자.

```
quickSort(A[], p, r) {
  if (p < r) {
    q = partition(A, p, r); // 분할
    quickSort(A, p, q-1); // 왼쪽 부분배열 정렬
    quickSort(A, q + 1, r)
  }
}

partition(A[], p, r) {
  배열 A[p...r]의 원소들을 A[r]을 기준으로 양쪽으로 재배치하고
  A[r]이 자리한 위치를 return 한다.
}
```

pivot을 partition때마다 옮기게 되면 복잡도가 높아진다. 따라서 pivot은 partition 전까지 그 자리에 위치하고, 마지막에 작은 값들과 큰 값들의 사이에 넣어준다.

```
[...작은 값들, ...큰 값들, pivot]

==> 

[...작은 값들, pivot, ...큰 값들, 큰 값들의 첫번째 인덱스 ]
```

pivot보다 큰지 작은지 비교하려면, pivot과의 비교가 한 번씩은 필요하다.

인덱스 변수 i, j를 두어, i는 pivot보다 작은 값들 중 마지막 값을 가리키고, j는 지금 검사하려는 값을 가리킨다고 가정해 보자.

그렇다면 다음과 같이 쓸 수 있다,

```
if A[j] >= pivot
  j = j + 1; // 아무것도 하지 않는다
else
  i = i + 1;
  exchange A[i] and A[j];
  j = j + 1;
```

이를 의사 코드로 나타내 보자

```
partition(A, p, r) {
  pivot = A[r];
  i = p - 1; // (아직 pivot보다 작은 값이 없으므로);

  for (j=p; j<r-1; j++) {
    if A[j] <= pivot:
      i = i+1;
      exchange A[i] and A[j];
  }

  exchange A[i + 1] and A[r];
  return i + 1;
}
```

지금까지의 코드를 실제 코드로 나타내면 다음과 같다.

```javascript
function quick(arr, left = 0, right = arr.length - 1) {
  function partition(arr, left, right) {
    const pivot = arr[right];
    let i = left - 1,
      j = left;

    while (j < right) {
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      j++;
    }

    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
    return i + 1;
  }

  if (left < right) {
    const position = partition(arr, left, right);
    quick(arr, left, position - 1);
    quick(arr, position + 1, right);
  }
  return arr;
}
```

#### 시간복잡도는 어떨까?

최악의 경우는 이미 정렬된 입력 데이터가 들어올 경우이다.

피봇이 항상 남아있는 데이터보다 최대값이거나, 최소값일 경우로 볼 수 있다.

이렇게 되면 분할의 한쪽은 빈 데이터, 한쪽은 n-1의 데이터가 들어올 것이고, 시간복잡도의 식은 다음과 같이 된다.

T(n) = O(n) + O(n-1) + O(n - 2) + ... + O(2) + O(1)

= O(N^2)

반대로, 한쪽이 적어도 1/9 이상이라면 충분히 빠르다.

이 경우에는 mergeSort와 같이 NlogN 이 되지만, mergeSort보다는 두배 가량 빠르다.

#### Pivot의 선택에 대한 고찰

**첫번째 값이나 마지막 값을 피봇으로 선택할 경우**

- 이미 정렬된 데이터 혹은 거꾸로 정렬된 데이터가 최악의 경우
- 현실의 데이터는 랜덤하지 않으므로, 정렬된 데이터가 입력으로 들어올 가능성은 매우 높음
- 따라서 좋은 방법이라고 할 수 없음

**Median of Three**

- 첫번째 값과 마지막 값, 그리고 가운데 값 중에서 중간값(median)을 피봇으로 선택
- 하지만 최악의 경우 시간복잡도가 달라지지는 않음

**Randomized Quicksort**

- 피봇을 랜덤하게 선택
- no worst case instance, but worst case execution
- 평균 시간복잡도 O(NlogN)

출처: [권오흠 교수님 알고리즘 강좌](https://www.inflearn.com/course/%EC%95%8C%EA%B3%A0%EB%A6%AC%EC%A6%98-%EA%B0%95%EC%A2%8C/dashboard)