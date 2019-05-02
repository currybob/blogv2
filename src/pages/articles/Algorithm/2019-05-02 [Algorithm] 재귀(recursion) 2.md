---
title: '[Algorithm] 재귀(recursion) 2'
date: "2019-05-02T12:43:48.528Z"
layout: "post"
draft: false
path: "/posts/14"
category: "Algorithm"
tags:
  - "Algorithm"
  - "재귀"
description: "미로 찾기 문제를 해결합니다."
---

### Recursion 2.

#### 미로찾기

recursion 으로 해결하는 것이 가장 간편

현재 위치에서 출구까지 가는 경로가 있으려면, 
	
- 현재 위치가 출구이거나, 혹은
- 이웃한 셀들 중 하나에서 **다시 현재 위치를 지나지 않고** 출구까지 가는 경로가 있거나

여기에서는 큰 문제를 쪼개서 해결하는 분할정복 기법을 통해 문제를 해결한다. 재귀로 해결할 수 있으며, 재귀에서는 다음과 같은 것을 고려해야 한다.

- 무한루프에 빠지지 않도록 항상 주의
- base case 가 반드시 있어야 한다
- 모든 recursion은 base case로 수렴해야 한다.

#### 답이 yes or no 라면 (Decision problem)?

psuedo code

```java
boolean findPath(x, y) {
	if (x, y) is the exit
		return true;
	else
		for each neighbouring cell(x', y') of (x, y) do
			if (x', y') is on the pathway
				if (findPath(x', y'))
					return true;
		return false;
}	
```

- 위의 코드는 어떤가?
- x', y'에서 recursion을 돌릴 때, x,y가 다시 인접한 셀이 될 수 있기 때문에 무한히 두 셀을 왔다 갔다 할 수 있음.
- 어떻게 방지할 수 있을까?

```java
boolean findPath(x, y)
	if (x, y) is the exit
		return true;
	else
		*mark (x, y) as a visited cell;
		for each neighbouring cell (x', y') of (x, y) do
			if (x', y') is on the pathway(not block) *and not visited
				if findPath(x', y')
					return true
			
		return false;
```

조건문을 처음에 분기

```java
boolean findPath(x, y)
	if (x, y) is either on the wall or a visited cell
		return false;
	else if (x, y) is the exit
		return true
	else
		mark(x, y) as a visited cell
		for each neighbouring cell (x', y') of (x, y) do
			if findPath(x', y')
				return true
		return false
```

실제 코드

```java
public class Maze {
	private static int N=8;
	private static int[][] maze = {
		{0,0,0,0,0,0,0,1}
		{0,1,1,0,1,1,0,1}
		{0,0,0,1,0,0,0,1}
		{0,1,0,0,1,1,0,0}
		{0,1,1,1,0,0,1,1}
		{0,0,0,1,0,0,0,1}
		{0,1,1,1,0,1,0,0}
	} // 통로는 0, 벽은 1
	
	private static final int PATHWAY_COLOUR = 0; // 갈 수 있는 길
	private static final int WALL_COLOUR = 1; // 벽
	private static final int BLOCKED_COLOUR = 2; // 이미 방문했지만 막힌 색
	private static final int PATH_COLOUR = 3; // 이미 방문했지만 아직까지는 확실히 판정이 안된 경우
	// 처음 녹색으로 칠하고, 출구가 없으면 붉은색으로 칠함.
	
	public static void main(String[] args) {
		printMaze();
		findMazePath(0, 0);
		printMaze();
	}
	
	public static boolean findMazePath(int x, int y) {
		if (x<0 || y<0 || x>=N || y>= N) // 미로의 바깥
			return false;
		else if (maze[x][y] !== PATHWAY_COLOUR) // visited(green or red), or wall
			return false;
		else if (x==N-1 && y== N-1) // this point is exit
			maze[x][y] = PATH_COLOUR;
			return true;
		else
			maze[x][y] = PATH_COLOUR;
			if (findMazePath(x-1, y) || findMazePath(x, y+1) || findMazePath(x+1, y) || findMazePath(x, y-1)) 
				return true;
			maze[x][y] = BLOCKED_COLOUR; // dead end, 즉 이 위치에서는 더이상 갈 수 없다.
			return false;
	}
}
```