<template>
  <div>
    <v-tour
      class="text-lg"
      name="mainTour"
      :steps="tourSteps"
      :callbacks="tourCallbacks"
    />
    <div class="container mx-auto px-2 lg:px-6 py-4 md:py-6">
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
      <Navigation id="main-nav" />
      <br />
      <Columns>
        <Column side="left" width="1/3">
          <Square color="dark">
            <Heading size="large">
              <span id="main-spr-title">School Progress Report</span>
            </Heading>
            <p class="text-xl">
              For the {{ $store.getters.sy_c_all }} school year
            </p>
            <button
              id="main-tour-button"
              class="blink text-blue-800 bg-white px-2 py-1 my-1 text-base font-bold uppercase hover:bg-gray-200 focus:outline-none"
              @click="launchTour"
            >
              Give me a tour
            </button>
            <spr-tier-key class="mt-2" />
          </Square>
          <Square id="main-filter-panel" color="tint" class="sticky top-0">
            <QlikSelectedFilterPills />
            <QlikFilter
              id="main-domains"
              class="mt-2"
              title="Select a specific Domain"
              field="Domain_Name_Possible"
              prevent-sort-by-state
              prevent-multiple-selections
              @change="handleFieldSelections"
            />
            <QlikFilter
              v-if="$store.getters['selections/oneDomainSelected']"
              class="mt-2"
              style="max-height: 360px"
              :title="
                'Select a specific ' +
                  $store.state.selections.domain +
                  ' Metric'
              "
              field="Metric_Name_Possible"
              prevent-multiple-selections
              @change="handleFieldSelections"
            />

            <QlikCollapsableFilterContainer
              id="main-filters"
              :field-values="[
                { field: 'SPR Report Type' },
                { field: 'Sector' },
                { field: 'Learning Network', label: 'Network' },
                { field: 'Year' }
              ]"
              :blacklist-fields="[
                'School Name (Reporting Category)',
                'Domain_Name_Possible'
              ]"
              @change="handleSelections"
            />
            <QlikFilter
              id="main-school-filter"
              style="max-height: 400px"
              title="School Name and Report Type"
              field="School Name (Reporting Category)"
              @change="handleFieldSelections"
            />
          </Square>
        </Column>
        <Column id="main-content-side" side="right" width="2/3">
          <Nuxt />
        </Column>
      </Columns>
    </div>
    <Footer />
  </div>
</template>

<script>
import SelectionsMixin from '~/mixins/SelectionsMixin'
import Header from '~sdp-components/Header/Header'
import Navigation from '~/components/Navigation'
import Footer from '~sdp-components/Footer/Footer'
import Columns from '~sdp-components/PageElements/Columns'
import Column from '~sdp-components/PageElements/Column'
import QlikSelectedFilterPills from '~sdp-components/Qlik/QlikSelectedFilterPills'
import QlikCollapsableFilterContainer from '~sdp-components/Qlik/QlikCollapsableFilterContainer'
import QlikFilter from '~sdp-components/Qlik/QlikFilter'
import Square from '~sdp-components/PageElements/Square'
import Heading from '~sdp-components/PageElements/Heading'
import SprTierKey from '~/components/SprTierKey'

export default {
  components: {
    Header,
    Navigation,
    Footer,
    Columns,
    Column,
    QlikSelectedFilterPills,
    QlikFilter,
    QlikCollapsableFilterContainer,
    Square,
    Heading,
    SprTierKey
  },
  mixins: [SelectionsMixin],
  data() {
    return {
      tourSteps: [
        {
          target: '#main-spr-title',
          content:
            'Welcome to the School Progress Report (SPR) website. Here you can find data about school performance and climate for both district and public charters schools in Philadelphia.',
          params: { enableScrolling: true },
          offset: -400
        },
        {
          target: '#main-nav',
          content:
            'This website is divided into five sections. The first three sections display data about all schools. "School Report" and "Calculator" display data about a single school.',
          params: { enableScrolling: false }
        },
        {
          target: '#main-content-side',
          content:
            'Here you can view charts, maps, and tables related to SPR metrics.',
          params: { enableScrolling: true },
          offset: -400
        },
        {
          target: '#main-filter-panel',
          content:
            'On this panel you can find a number of filters to narrow down the displayed schools and metrics.',
          params: { enableScrolling: true },
          offset: -400
        },
        {
          target: '#main-domains',
          content:
            'SPR metrics are divided into categories, known as "Domains". You can select a specific domain to change the displayed values. After selecting a domain, you can further select a single metric.',
          params: { enableScrolling: false }
        },
        {
          target: '#main-filters',
          content:
            'Use the filters to narrow down school or report characteristics.',
          params: { enableScrolling: false }
        },
        {
          target: '#main-school-filter',
          content:
            'Use the school filter to choose one or more school reports. Some schools may have more than one report (for example Middle-High schools).',
          params: { enableScrolling: false }
        },
        {
          target: '#main-tour-button',
          content: 'Press here to take this tour again.',
          params: { enableScrolling: true },
          offset: -400
        }
      ],

      tourCallbacks: {
        onSkip: () => this.$store.dispatch('tour/initialize_main'),
        onFinish: () => this.$store.dispatch('tour/initialize_main')
      }
    }
  },
  computed: {
    print() {
      return this.$route.query?.print === 'true' || false
    }
  },
  mounted() {
    if (!this.$store.state.tour.main_initialized) this.launchTour()
  },
  /**
   * Remove field values that we don't want to carry to other pages
   */
  async destroyed() {
    const fieldsToClear = ['Metric_Name_Possible', 'Domain_Name_Possible']
    const engine = await this.$qlik.engine
    let field
    fieldsToClear.forEach(async fieldName => {
      field = await engine.getField(fieldName)
      await field.clear()
    })
  },
  methods: {
    launchTour() {
      this.$tours.mainTour.start()
    }
  }
}
</script>
<style lang="postcss" scoped>
.blink {
  animation-name: blink-in;
  animation-duration: 3s;
  animation-delay: 2s;
  animation-timing-function: linear;
}

@keyframes blink-in {
  0% {
    background-color: white;
  }
  10% {
    background-color: #2a4365;
  }
  20% {
    background-color: white;
  }
  30% {
    background-color: #2a4365;
  }
  40% {
    background-color: white;
  }
  50% {
    background-color: #2a4365;
  }
  60% {
    background-color: white;
  }
  70% {
    background-color: #2a4365;
  }
  80% {
    background-color: white;
  }
  90% {
    background-color: #2a4365;
  }
  100% {
    background-color: white;
  }
}
</style>
