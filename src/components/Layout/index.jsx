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
          defaultTitle="김원호의 Dev Log"
          link={[
            {
              rel: 'shortcut icon',
              type: 'image/icon',
              href: `${favicon}`,
            },
          ]}
        >
          <meta
            name="google-site-verification"
            content="CL7-_UBaFL9ZdAGFf1_vvz2eCPAY3S-hbMqIwISq0bQ"
          />
        </Helmet>
        {children}
      </div>
    )
  }
}

export default Layout
