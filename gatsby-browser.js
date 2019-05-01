export const onServiceWorkerUpdateFound = () => {
  const answer = window.confirm(
    '버전이 업데이트되었습니다.\n최신 버전으로 새로고침하시겠습니까?'
  )

  if (answer === true) {
    window.location.reload()
  }
}

export const registerServiceWorker = () => true
