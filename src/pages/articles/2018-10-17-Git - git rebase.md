---
title: 'Git rebase'
date: "2018-10-17"
layout: "post"
draft: false
path: "/posts/7"
category: "Git"
tags:
  - "Git"
---

### 개요
Git을 사용하다 보면 간혹 commit history를 조정하고 싶을 때가 있다.
혹은 브랜치 간 merge를 할 때, Merge commit 메시지를 남기고 싶지 않다고 한다면 root commit을 조정한 뒤 merge를 해야할 때가 있다.
이때 git rebase 를 사용한다.

```
git rebase
```

### 브랜치 병합
브랜치를 나누어 작업을 할 때, 해당 브랜치의 분기 시점 이후로 각기 다른 commit이 발생했다면, Merge를 할 때 Merge내용에 대한 커밋이 자동으로 하나 더 생성된다.<br>
이 커밋이 생성되는 데는 나름의 이유가 있지만, 혹여 이를 방지하기 위한 방법은 다음과 같다.

```
git checkout "작업 브랜치"
git rebase "병합을 진행할 master 브랜치"

... (현재 작업 브랜치의 commit 이력 생성)

git checkout master
git merge "작업 브랜치"
```

큰 변화가 없는 듯 보이지만 log를 확인해 보면 Merge log 없이 깔끔하게 작업에 대한 내용만 commit 된 것을 볼 수 있다.

### 히스토리 조정
commit 에 대한 history 조정은 일반적으로 대화형 옵션을 주어 사용한다.<br>
명령어는 다음과 같다

HEAD로부터 특정 수의 커밋 조정
```
git rebase -i HEAD~"조정하려는 커밋 수"
```

맨 처음 커밋부터 조정
```
git rebase -i --root
```

이 명령어를 입력하게 되면 다음과 같은 창이 뜬다.<br>
<img src="/assets/images/screenshot/스크린샷 2018-10-17 오후 9.56.31.png" alt="rebase 대화창">

필자는 vim을 사용하기 때문에 vim창이 열렸다. 보다시피 여러 옵션이 있는데, pick이 기본 옵션이다.
여기서의 로그는 차례대로 뜬다. 즉 git log명령어에서 보는 것과는 반대의 순서이다.

이 창에서 나가려면 vim 입력 모드에서 cq를 입력하면 된다.

**이 커밋 로그들을 순서를 바꿀 수도 있고, 합칠 수 있으며, 메시지 뿐 아니라 내용을 수정할 수도 있다.**

먼저 편집을 위해서는 편집을 원하는 커밋 로그의 pick을 edit으로 바꾸어주고, 입력창에서 wq를 입력해 저장한다.
그러면 해당 커밋으로 checkout되며, 이 시점에서 코드를 변경하면 된다.

변경한 다음에는 ```git commit --amend``` 명령어로 commit 내용을 수정해준다.<br>
아직 rebase 모드이므로 ```git rebase --continue```를 수행하면 rebase가 완료된다.

다음으로 합치려면 squash, fixup 명령어를 쓰면 된다.
squash와 fixup의 차이는 squash는 메시지를 합치지만, fixup은 대상이 되는 커밋의 메시지를 무시하고, 기준 커밋의 메시지에 맞춘다는 것이다.

방식은 다음과 같다<br>
```
pick "기준이 되는 커밋"
squash "합칠 커밋"
squash "합칠 커밋 2"

// 결과
// git log
// 기준이 되는 커밋
// 합칠 커밋
// 합칠 커밋 2

or

pick "기준이 되는 커밋"
fixup "합칠 커밋"
squash "합칠 커밋 2"

// 결과
// git log
// 기준이 되는 커밋
// 합칠 커밋 2
```

또, 순서를 바꾸려면 단순히 pick의 순서를 바꾸어주면 된다.
단, 이 과정에서 conflict가 발생하여 완전히 순서가 바뀌지 않을 수 있다. 따라서 주의가 필요하다.

rebase의 기능은 이것 외에도 상당히 많지만, 자주 쓰이는 부분을 정리해 보았다.