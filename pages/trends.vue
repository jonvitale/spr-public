<template>
  <div>
    <ScrollSpyNav
      class="sticky top-0 bg-white"
      title="Charts:"
      :refs="['v-trends', 'v-sankey', 'v-table', 'v-scatter']"
      orientation="row"
    />
    <div class="flex flex-wrap">
      <Square
        ref="v-trends"
        name="Trend Lines"
        class="w-full flex flex-wrap mb-4"
        color="light"
        tight
      >
        <QlikKPI
          ref="kpiTrends"
          class="max-w-sm"
          :q-id="kpiTrends.qId"
          :subtitle="kpiTrends.subtitle"
          :secondary-label="kpiTrends.secondaryLabel"
          :description="kpiTrends.description"
        />
        <QdtComponent
          type="QdtViz"
          :props="trends"
          class="flex-auto m-2 p-2 bg-white"
        />
      </Square>
      <Square
        v-if="!$store.getters['selections/oneSchoolSelected']"
        ref="v-sankey"
        name="Flow Diagram"
        class="w-full flex flex-wrap mb-4"
        color="tint"
        tight
      >
        <div class="max-w-xs flex-col">
          <QlikKPI
            ref="kpiSankey1"
            class="max-w-xs"
            :q-id="kpiSankey1.qId"
            :subtitle="kpiSankey1.subtitle"
            :secondary-label="kpiSankey1.secondaryLabel"
            :description="kpiSankey1.description"
          />
          <QlikKPI
            ref="kpiSankey2"
            class="max-w-xs"
            :q-id="kpiSankey2.qId"
            :subtitle="kpiSankey2.subtitle"
            :secondary-label="kpiSankey2.secondaryLabel"
            :description="kpiSankey2.description"
          />
        </div>
        <QdtComponent
          class="flex-auto bg-white"
          type="QdtViz"
          :props="sankey"
        />
      </Square>
      <Square
        ref="v-table"
        name="Table"
        class="mb-4 w-full"
        color="white"
        tight
      >
        <QdtComponent class="w-full" type="QdtViz" :props="table" />
      </Square>
      <Square
        v-if="!$store.getters['selections/oneSchoolSelected']"
        ref="v-scatter"
        name="Scatterplot"
        class="mb-4 w-full"
        color="dark"
      >
        <QdtComponent class="w-full" type="QdtViz" :props="scatter" />
      </Square>
    </div>
  </div>
</template>

<script>
import QdtComponent from '~sdp-components/Qdt/QdtComponent'
import QlikKPI from '~sdp-components/Qlik/QlikKPI'
import Square from '~sdp-components/PageElements/Square'
import ScrollSpyNav from '~sdp-components/Navigation/ScrollSpyNav'

export default {
  layout: 'main',
  components: {
    QdtComponent,
    QlikKPI,
    Square,
    ScrollSpyNav
  },
  data() {
    return {
      selectedDomain: '',
      trendDomainSelected: 'overall'
    }
  },
  computed: {
    // Qlik Objects
    kpiTrends() {
      return {
        qId: 'XTmmsjm',
        title: 'Average % Earned - Overall',
        subtitle: ' ',
        secondaryLabel: 'From  ' + this.$store.getters.sy_p,
        description: ' '
      }
    },
    trends() {
      return {
        id: 'f4893eee-2016-415d-89e8-b3078b67ecb4',
        type: 'lineChart',
        height: '300px'
      }
    },
    kpiSankey1() {
      return {
        qId: '0d2b6074-a1dd-446d-9309-70a9d5b23019',
        title: '# Increased % Earned',
        subtitle: ' ',
        secondaryLabel: '% of Reports'
      }
    },
    kpiSankey2() {
      return {
        qId: '77bfb314-34ab-4bde-b0a4-97fb95d31292',
        title: '# Increased Tier',
        subtitle: ' ',
        secondaryLabel: '% of Reports'
      }
    },
    sankey() {
      return {
        id: 'b38403aa-c472-4566-9b81-3eb374866388',
        type: 'extension',
        height: '400px'
      }
    },
    table() {
      return {
        id: 'a1196e2b-acc2-4831-9f05-8b57ae22a0a9',
        type: 'table',
        height: '600px'
      }
    },
    scatter() {
      return {
        id: 'NmGYw',
        type: 'scatterplot',
        height: '600px'
      }
    }
  },

  mounted() {
    this.$qlik.setVariableValueByName(
      'vSelector_DomainYearlyTrends_AggLevel',
      'Sector'
    )
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
    handleDomainSelected(values) {
      const selected = values.filter(val => val.isSelected)
      if (selected.length) {
        this.selectedDomain = selected[0].text
      } else {
        this.selectedDomain = ''
      }
    },

    handleTrendDomainSelection(domainId, domainName) {
      this.trendDomainSelected = domainId
      this.$set(this.kpiTrends, 'title', 'Average % Earned - ' + domainName)
      if (domainId === 'overall') {
        this.$set(this.kpiTrends, 'qId', 'XTmmsjm')
        this.$set(this.trends, 'id', 'f4893eee-2016-415d-89e8-b3078b67ecb4')
      } else if (domainId === 'achievement') {
        this.$set(this.kpiTrends, 'qId', 'GzXTpG')
        this.$set(this.trends, 'id', '7e725e20-f2e5-4ad2-bc12-52f4c2c5993f')
      } else if (domainId === 'progress') {
        this.$set(this.kpiTrends, 'qId', 'MeYDjn')
        this.$set(this.trends, 'id', 'f63a00b1-4b7e-4853-a97a-9eabe4a648a0')
      } else if (domainId === 'climate') {
        this.$set(this.kpiTrends, 'qId', 'RhCHDh')
        this.$set(this.trends, 'id', 'ca30500e-55b6-4a63-b4bf-30666c75b519')
      } else if (domainId === 'cc') {
        this.$set(this.kpiTrends, 'qId', 'VeTpSsp')
        this.$set(this.trends, 'id', '6334dd68-d2f2-4e88-9d14-df10f38a8c66')
      }
      this.$forceUpdate()
    }
  }
}
</script>
