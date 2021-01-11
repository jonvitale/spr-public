<template>
  <div>
    <div class="container mx-auto px-2 lg:px-6 py-4 md:py-6">
      <div v-if="!print">
        <Header>
          <div
            class="bg-red-600 p-2 font-semibold text-white text-sm"
            style="width: 640px;"
          >
            Due to the COVID-19 pandemic and the associated school closures and
            assessment cancellations, the SPR was not able to be produced for
            SY2019-2020. This page includes data from the SY2018-2019 SPR.
          </div>
        </Header>
        <br />
        <Navigation />
        <br />
      </div>
      <Nuxt />
    </div>
    <Footer v-if="!print" />
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
  },
  computed: {
    print() {
      return this.$route.query.print === 'true' ?? false
    }
  }
}
</script>
