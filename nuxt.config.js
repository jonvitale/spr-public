import { resolve, join } from 'path'

const isTesting = true

const appName = isTesting ? 'spr-public-test' : 'spr-public'


export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['~/node_modules/vue-tour/dist/vue-tour.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/qdt.config.js',
    join(resolve(__dirname), '../sdp-vue-components/plugins/qlik.config'),
    '~/plugins/init.store.js',
    { src: '~/plugins/vue-unicons.js', mode: 'client' },
    '~/plugins/vue-tour.js' // note remember, purgecss (whitelist v-tour, v-step)
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['nuxt-webfontloader', 'vue-scrollto/nuxt'],
  webfontloader: {
    google: {
      families: ['Roboto:wght@700']
    }
  },

  /**
   * purgeCss:
   * note that the following paths simply add to the default
   */
  purgeCSS: {
    enabled: true,
    paths: [
      '../sdp-vue-components/components/**/*.vue',
      '../sdp-vue-components/layouts/**/*.vue',
      '../sdp-vue-components/pages/**/*.vue',
      '../sdp-vue-components/plugins/**/*.js'
    ],
    whitelistPatterns: [/v-tour/, /v-step/],
    rejected: true
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config.devtool = 'source-map'
      config.resolve.alias['~sdp-components'] = join(
        resolve(__dirname),
        '../sdp-vue-components/components'
      )
      config.resolve.alias['~sdp-plugins'] = join(
        resolve(__dirname),
        '../sdp-vue-components/plugins'
      )
    }
  },

  router: {
    mode: 'hash',
    base:
      process.env.NODE_ENV === 'dev'
        ? `/extensions/${appName}`
        : `/extensions/${appName}`,
    routeNameSplitter: '/'
    // extendRoutes(routes, resolve) {
    //   routes.push(
    //     {
    //       path: '*',
    //       component: resolve(__dirname, 'pages/index'),
    //       name: 'index'
    //     }
    //   )
    // }
  }
}
