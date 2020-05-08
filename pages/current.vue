<template>
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
        <QlikFilter 
          v-if="selectedDomain"
          :qlikAPI="$qlik"
          class="mt-2"       
          style="max-height: 360px"       
          :title="'Select a specific ' + selectedDomain + ' Metric'"
          field="Metric_Name"
          preventMultipleSelections
          :expression="'Only({<[Domain_Name]={\''+ selectedDomain + '\'}]>}[Metric_Name])'"
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
    <Column side="right" width="2/3" ref="content-column">
      <ScrollSpyNav 
        class="sticky top-0 bg-white"
        title="Charts:"
        :refs="['v-distribution', 'v-map', 'v-table']"
        orientation="row"
        />
      <div class="flex flex-wrap">
        <div 
          ref="v-distribution" 
          name="Distribution"
          class="mb-2"
          >
          <Square class="mb-4" color="light" tight>
            <div class="flex flex-row" >
              <QlikKPI 
                class="max-w-sm"
                ref="kpi1"
                :qId="kpi1.qId"
                :subtitle="kpi1.subtitle"
                :secondaryLabel="kpi1.secondaryLabel" 
                :description="kpi1.description" 
                />
              <QdtComponent 
                class="flex-auto m-2 p-2 bg-white"
                style="min-width:400px"
                type="QdtViz" 
                :props="distribution" 
                />
            </div>
            <div class="flex flex-row justify-center">
              <ButtonGroup
                :options="{
                  'current': 'Current Year',
                  '3year': '3-Year Average',
                  }"
                @buttonClicked="handleYearSelection($event.id, $event.value)" 
                />
            </div>
          </Square>
        </div>
        <div 
          ref="v-map" 
          name="Map">
          <Square class="flex w-full" color="white" tight>
            <QdtComponent type="QdtViz" :props="map" />
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
      </div>
    </Column>
  </Columns>
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
      // Qlik Objects
      kpi1: {        
        'qId': 'XTmmsjm',
        'title': '', 
        'subtitle': ' ',
        'secondaryLabel': 'From  ' + this.$store.state.SY_P,
        'description': ' '
      },
      map: {
        id: 'jKmNJ', type: 'extension', height: '600px',
      },
      distribution: {
        id: 'gpLpNXS', type: 'extension', height: '400px',
      },
      table: {
        id: 'BSXpST', 
        type: 'table', 
        width: '800px', 
        height: '600px'
      },
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

    handleYearSelection (yearId, yearName) {
      console.log("handleYearSelection", yearId, yearName)
      if (yearId == 'current') {
        this.$qlik.setVariableValueByName('vSelectedMeasure_YOY', 'PercScore_Current')
        this.$set(this.kpi1, "title", "Average % Earned - " + (this.selectedDomain ? this.selectedDomain : "Overall"))
        this.$set(this.kpi1, "qId", "XTmmsjm")
      } else if (yearId == '3year') {
        this.$qlik.setVariableValueByName('vSelectedMeasure_YOY', 'PercScore_3Year_Current')
        this.$set(this.kpi1, "title", "3-Year Average % Earned - " + (this.selectedDomain ? this.selectedDomain : "Overall"))
        this.$set(this.kpi1, "qId", "ghWAbL")
      }
      this.$forceUpdate()
    }
  },
  
  /**
   * Remove field values that we don't want to carry to other pages
   */  
  async destroyed() {    
    const fieldsToClear = ["Metric_Name", "Domain_Name"]
    const engine = await this.$qlik.engine
    let field
    fieldsToClear.forEach(async fieldName => {
      field = await engine.getField(fieldName)
      await field.clear()
    })
  }
}
</script>