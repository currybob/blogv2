import icon from './src/assets/images/photo.jpg'

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    '버전이 업데이트되었습니다.\n최신 버전으로 새로고침하시겠습니까?'
  )

  if (answer) window.location.reload()
}

export const onServiceWorkerRedundant = ({ serviceWorker }) => {
  serviceWorker.unregister()
}

export const onServiceWorkerActive = async ({ serviceWorker }) => {
  const pushPermission = await Notification.requestPermission()

  if (pushPermission === 'granted') {
    serviceWorker.showNotification('안녕하세요', {
      body: '김원호 블로그에 오신 것을 환영합니다',
      icon,
    })
  }
}
