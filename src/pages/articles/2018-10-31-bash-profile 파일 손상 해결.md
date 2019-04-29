---
title: 'bash-profile 파일 손상 해결'
date: "2018-10-31"
layout: "post"
draft: false
path: "/posts/11"
category: "개발환경"
tags:
  - "개발환경"
---


### 오류 내용
맥에 새 환경변수 세팅을 하다가 로그인 쉘의 bash_profile에 잘못된 값을 넣고 저장해 파일이 꼬였다. 터미널이 잡고있는 홈 디렉토리가 바뀌고, bin폴더 하위의 모든 명령어가 작동을 하지 않는다. 

### 해결
본인같은 경우에는 지우고 다시 만드는 방법을 택했다.<br>
루트 디렉토리에는 접근이 가능했으므로 ```/bin/rm``` 명령어로 기존의 bash profile을 삭제했다.

그리고 수동으로 환경변수 경로를 재설정해줌으로써 간단하게 해결되었다.
```
export PATH=/bin:/usr/bin:/usr/local/bin
```

이후 다시 홈 디렉토리에 bash_profile을 만들어주면 된다.
```
vim ~/.bash_profile
```

환경변수 재설정 전에 bash profile에 접근해 수정하려면 /usr/bin/폴더 하위의 vim이나 nano를 써야 한다.
```
/usr/bin/vim ~/.bash_profile
```
