<template>
  <div>
    <div class="container mx-auto px-2 lg:px-6 py-4 md:py-6">
      <Header />
      <br />
      <Navigation />
      <br />
      <Nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '~sdp-components/Header/Header'
import Navigation from '~/components/Navigation'
import Footer from '~sdp-components/Footer/Footer'

export default {
  components: {
    Header,
    Navigation,
    Footer
  }
}
</script>
