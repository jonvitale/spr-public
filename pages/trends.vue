<template>
  <section>
    <Columns>
      <Column side="left" width="1/3">
        <Square color="dark">
          <Heading size="large">School Progress Report</Heading>
          <p> For the {{ $store.state.SY_C }} school year</p>
        </Square>
        <Square color="tint">      
          <QlikFilter 
            :qlikAPI="$qlik"
            class="mt-2"              
            title="Select a specific Domain"
            field="Domain_Name"
            preventMultipleSelections
            @changed="handleDomainSelected" 
          />       
          <QlikFiltersCollapsable 
            :qlikAPI="$qlik"
            :fieldValues="[
            {field:'SPR Report Type'},
            {field:'Sector'},               
            {field:'Learning Network', title:'Network'},
          ]" />            
          <QlikFilter 
            :qlikAPI="$qlik"
            class="mt-3"
            style="max-height: 360px"
            title="School and Report Type"
            field="School Name (Reporting Category)" 
          />
        </Square>
      </Column>
      <Column side="right" width="2/3" >
        <ScrollSpyNav 
          class="sticky top-0 bg-white"
          title="Charts:"
          :refs="['v-trends', 'v-sankey', 'v-table', 'v-scatter']"
          orientation="row"
          />
        <div class="flex flex-wrap w-full">
          <div 
            ref="v-trends" 
            name="Trend Lines"
            class="mb-2"
            >
            <Square class="mb-4" color="light" tight>
              <div class="flex flex-row" >
                <QlikKPI 
                  class="max-w-sm"
                  ref="kpiTrends"
                  :qId="kpiTrends.qId"
                  :subtitle="kpiTrends.subtitle"
                  :secondaryLabel="kpiTrends.secondaryLabel" 
                  :description="kpiTrends.description" 
                  />
                <QdtComponent 
                  class="flex-auto m-2 p-2 bg-white"
                  style="min-width:400px"
                  type="QdtViz" 
                  :props="trends" 
                  />
              </div>
              <div class="flex flex-row justify-center">
                <ButtonGroup
                  :options="{
                    'overall': 'Overall',
                    'achievement': 'Achievement', 
                    'progress': 'Progress', 
                    'climate': 'Climate', 
                    'cc': 'College & Career'
                    }"
                  @buttonClicked="handleTrendDomainSelection($event.id, $event.value)" 
                  />
              </div>
            </Square>
          </div>
          <div 
            ref="v-sankey" 
            name="Flow Diagram"
            class="mb-2"
            >
            <Square class="flex flex-row mb-4" color="tint" tight>
              <div class="flex-flex-col">
                <QlikKPI 
                  class="max-w-sm"
                  ref="kpiSankey1"
                  :qId="kpiSankey1.qId"
                  :subtitle="kpiSankey1.subtitle"
                  :secondaryLabel="kpiSankey1.secondaryLabel" 
                  :description="kpiSankey1.description" 
                  />
                <QlikKPI 
                  class="max-w-sm"
                  ref="kpiSankey2"
                  :qId="kpiSankey2.qId"
                  :subtitle="kpiSankey2.subtitle"
                  :secondaryLabel="kpiSankey2.secondaryLabel" 
                  :description="kpiSankey2.description" 
                  />
              </div>
              <QdtComponent 
                type="QdtViz" 
                :props="sankey" 
                />
            </Square>
          </div>
          <div 
            ref="v-table" 
            name="Table">
            <Square class="flex flex-row mb-4" color="white" tight>
              <QdtComponent 
                type="QdtViz" 
                :props="table"
                />
            </Square>
          </div>
          <div 
            ref="v-scatter" 
            name="Scatterplot">
            <Square class="flex flex-row mb-4" color="light" tight>
              <QdtComponent 
                type="QdtViz" 
                :props="scatter"
                />
            </Square>
          </div>
        </div>
      </Column>
    </Columns>
  </section>
</template>

<script>
import QdtComponent from '~sdp-components/Qdt/QdtComponent'
import QlikFilter from '~sdp-components/Qlik/QlikFilter'
import QlikFiltersCollapsable from '~sdp-components/Qlik/QlikFiltersCollapsable'
import QlikKPI from '~sdp-components/Qlik/QlikKPI'
import Horizontal from '~sdp-components/PageElements/Horizontal'
import Columns from '~sdp-components/PageElements/Columns'
import Column from '~sdp-components/PageElements/Column'
import Square from '~sdp-components/PageElements/Square'
import Heading from '~sdp-components/PageElements/Heading'
import ButtonGroup from '~sdp-components/PageElements/ButtonGroup'
import ScrollSpyNav from '~sdp-components/Navigation/ScrollSpyNav'

export default {
  components: {
    QdtComponent,
    QlikFilter,
    QlikFiltersCollapsable,
    QlikKPI,
    Columns,
    Column,
    Square,
    Horizontal,
    Heading,
    ButtonGroup,
    ScrollSpyNav,
  },
  data() { 
    return {
      selectedDomain: '',
      trendDomainSelected: 'overall',
      // Qlik Objects
      kpiTrends: {        
        'qId': 'XTmmsjm',
        'title': 'Average % Earned - Overall', 
        'subtitle': ' ',
        'secondaryLabel': 'From  ' + this.$store.state.SY_P,
        'description': ' ',
      },
      trends: {
        id: 'f4893eee-2016-415d-89e8-b3078b67ecb4', 
        type: 'lineChart', 
        height: '300px',
      },
      kpiSankey1: {
        'qId': '0d2b6074-a1dd-446d-9309-70a9d5b23019',
        'title': '# Increased % Earned', 
        'subtitle': ' ',
        'secondaryLabel': '% of Reports',
      },
      kpiSankey2: {
        'qId': '77bfb314-34ab-4bde-b0a4-97fb95d31292',
        'title': '# Increased Tier', 
        'subtitle': ' ',
        'secondaryLabel': '% of Reports',
      },
      sankey: {
        id: 'b38403aa-c472-4566-9b81-3eb374866388', 
        type: 'extension', 
        width: '500px', 
        height: '400px',
      },
      table: {
        id: 'a1196e2b-acc2-4831-9f05-8b57ae22a0a9', 
        type: 'table', 
        width: '800px', 
        height: '600px'
      },
      scatter: {
        id: 'NmGYw',
        type: 'scatterplot',
        width: '800px',
        height: '600px',
      }
    }
  },
  methods: {
    handleDomainSelected (values) {
      const selected = values.filter(val => val.isSelected)
      if (selected.length) {
        this.selectedDomain = selected[0].text
      } else {
        this.selectedDomain = ""
      }
    },

    handleTrendDomainSelection (domainId, domainName) {
      this.trendDomainSelected = domainId
      this.$set(this.kpiTrends, "title", "Average % Earned - " + domainName)
      if (domainId == 'overall') {
        this.$set(this.kpiTrends, "qId", "XTmmsjm")
        this.$set(this.trends, "id", "f4893eee-2016-415d-89e8-b3078b67ecb4")        
      } else if (domainId == 'achievement') {
        this.$set(this.kpiTrends, "qId", "GzXTpG")
        this.$set(this.trends, "id", "7e725e20-f2e5-4ad2-bc12-52f4c2c5993f")
      } else if (domainId == 'progress') {
        this.$set(this.kpiTrends, "qId", "MeYDjn")
        this.$set(this.trends, "id", "f63a00b1-4b7e-4853-a97a-9eabe4a648a0")
      } else if (domainId == 'climate') {
        this.$set(this.kpiTrends, "qId", "RhCHDh")
        this.$set(this.trends, "id", "ca30500e-55b6-4a63-b4bf-30666c75b519")
      } else if (domainId == 'cc') {
        this.$set(this.kpiTrends, "qId", "VeTpSsp")
        this.$set(this.trends, "id", "6334dd68-d2f2-4e88-9d14-df10f38a8c66")
      }
      this.$forceUpdate()
    }

  },

  async mounted () {
    // const contentWidth = Math.round(this.$refs['content-column'].getBoundingClientRect().width)
    // this.sankey.props.width = contentWidth + 'px'
    // console.log("sankey", this.sankey, contentWidth, this.$qlik.resize)
    // const variable = await this.$qlik.engine.getVariableByName("vSelector_DomainYearlyTrends_AggLevel")
    // const properties = await variable.getProperties()
    // if (properties.qNumberPresentation.qType == 'U' || properties.qNumberPresentation.qType == 'A') {
    //   await variable.setStringValue("Sector")
    // } else {
    //   await variable.setNumValue(1)
    // }
    // console.log("trends mounted", variable, properties)
    this.$qlik.setVariableValueByName("vSelector_DomainYearlyTrends_AggLevel", "Sector")
  },

  /**
   * Remove field values that we don't want to carry to other pages
   */  
  async destroyed() {    
    const fieldsToClear = ["Domain_Name"]
    const engine = await this.$qlik.engine
    let field
    fieldsToClear.forEach(async fieldName => {
      field = await engine.getField(fieldName)
      await field.clear()
    })
  }
}
</script>