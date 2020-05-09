const lost = require('lost')
const pxtorem = require('postcss-pxtorem')

module.exports = {
  siteMetadata: {
    url: 'https://undefine.me',
    siteUrl: 'https://undefine.me',
    title: '김원호 블로그',
    subtitle:
      '개발을 잡다하게 배워가는 중입니다. 자바스크립트에 관심이 많습니다.',
    footerMessage:
      '대부분 제가 배운 것들을 남기기 위해 글을 쓰고 있습니다.\
      이 글이 도움이 된다면 매우 기쁘겠지만, 설명이 다소 불친절하거나 오류가 있다면 댓글 남겨주세요.\
      더 성장하는 기회가 될 거에요 :)',
    copyright: '©2020 currybob All rights reserved.',
    disqusShortname: 'likelionwonhos-blog',
    menu: [
      {
        label: 'Articles',
        path: '/',
      },
      {
        label: 'About me',
        path: '/about/',
      },
    ],
    author: {
      name: '🚀 bob',
      email: 'rhwhdeodhkd@gmail.com',
      github: 'currybob',
      rss: 'rss.xml',
    },
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                site_url: url
                title
                description: subtitle
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map(edge =>
                Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.frontmatter.description,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.site_url + edge.node.fields.slug,
                  guid: site.siteMetadata.site_url + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                })
              ),
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                  filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
                ) {
                  edges {
                    node {
                      html
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                        layout
                        draft
                        description
                      }
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-mermaid',
            options: {
              theme: 'forest',
            },
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 960,
            },
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: { wrapperStyle: 'margin-bottom: 1.0725rem' },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: { trackingId: 'UA-139433739-1' },
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: ['Lato:400,400i,500,700', 'Ubuntu Mono:400,400i,500,700'],
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `
            {
              site {
                siteMetadata {
                  url
                }
              }
              allSitePage(
                filter: {
                  path: { regex: "/^(?!/404/|/404.html|/dev-404-page/)/" }
                }
              ) {
                edges {
                  node {
                    path
                  }
                }
              }
          }`,
        output: '/sitemap.xml',
        serialize: ({ site, allSitePage }) =>
          allSitePage.edges.map(edge => {
            return {
              url: site.siteMetadata.url + edge.node.path,
              changefreq: 'daily',
              priority: 0.7,
            }
          }),
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: '김원호 블로그',
        short_name: '김원호 블로그',
        start_url: '/',
        background_color: '#FDDE73',
        theme_color: '#FDDE73',
        display: 'standalone',
        icon: `${__dirname}/src/assets/images/photo.jpg`
      },
    },
    'gatsby-plugin-robots-txt',
    'gatsby-plugin-offline',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        postCssPlugins: [
          lost(),
          pxtorem({
            rootValue: 16,
            unitPrecision: 5,
            propList: [
              'font',
              'font-size',
              'line-height',
              'letter-spacing',
              'margin',
              'margin-top',
              'margin-left',
              'margin-bottom',
              'margin-right',
              'padding',
              'padding-top',
              'padding-left',
              'padding-bottom',
              'padding-right',
              'border-radius',
              'width',
              'max-width',
            ],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 0,
          }),
        ],
        precision: 8,
      },
    },
  ],
}
