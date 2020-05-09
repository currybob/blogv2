import React from 'react'
import Helmet from 'react-helmet'
import '../../assets/scss/init.scss'
import favicon from '../../assets/images/favicon.png'

class Layout extends React.Component {
  render() {
    const { children } = this.props

    return (
      <div className="layout">
        <Helmet
          defaultTitle="김원호 블로그"
          link={[
            {
              rel: 'shortcut icon',
              type: 'image/icon',
              href: `${favicon}`,
            },
          ]}
          meta={[
            {
              name: 'google-site-verification',
              content: 'CL7-_UBaFL9ZdAGFf1_vvz2eCPAY3S-hbMqIwISq0bQ',
            },
            {
              name: 'naver-site-verification',
              content: '0c9eb9ef4452e7b884e9361a8cb88bd1fff5e889',
            },
          ]}
        />
        {children}
      </div>
    )
  }
}

export default Layout
