// const path = require("path")
// const projectName = 'spr-config'

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
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/qdt.config.js',
    '../sdp-vue-components/plugins/qlik.config.js',
    '~/plugins/init.store.js',
    '../sdp-vue-components/plugins/breakpoints.js',
    { src: '~/plugins/vue-unicons.js', mode: 'client' },
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
      
      config.devtool = 'source-map'
      config.resolve.alias['~sdp-components'] = 'C:\\Users\\jvitale\\Documents\\Qlik\\Development\\SDP NUXT Mashup Environment\\sdp-vue-components\\components'
      config.resolve.alias['~sdp-plugins'] = 'C:\\Users\\jvitale\\Documents\\Qlik\\Development\\SDP NUXT Mashup Environment\\sdp-vue-components\\plugins'
      
    },
  },

  router: {
    mode: 'hash',
    base: process.env.NODE_ENV === 'dev' ? '/extensions/spr-public' : '/extensions/spr-public',
    routeNameSplitter: '/',
    extendRoutes (routes, resolve) {
      routes.push({
        path: "*",
        component: resolve(__dirname, 'pages/index'),
        name: "index"
      }, {
        path: "About",
        component: resolve(__dirname, 'pages/about'),
        name: "about"
      })
    }
  },
}
