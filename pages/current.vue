<template>
  <div>
    <ScrollSpyNav 
      class="sticky top-0 bg-white"
      title="Charts:"
      :refs="['v-distribution', 'v-map', 'v-table', 'v-points']"
      orientation="row"
      />
    <div class="flex flex-wrap">
      <Square 
        ref="v-distribution" 
        name="Distribution"
        class="mb-4 w-full" 
        color="light" 
        >
        <div class="flex flex-row" >
          <QlikKPI 
            class="w-full lg:w-1/2"
            ref="kpi1"
            :qId="kpi1.qId"
            :subtitle="kpi1.subtitle"
            :secondaryLabel="kpi1.secondaryLabel" 
            :description="kpi1.description" 
            />
          <QdtComponent 
            class="w-full lg:w-1/2 bg-white"
            type="QdtViz" 
            :props="distribution" 
            />
        </div>
        <div class="w-full flex flex-row justify-center">
          <ButtonGroup
            :options="{
              'current': 'Current Year',
              '3year': '3-Year Average',
              }"
            @buttonClicked="handleYearSelection($event.id, $event.value)" 
            />
        </div>
      </Square>
      <Square 
        ref="v-map" 
        name="Map"
        class="w-full mb-4 " color="dark"
        >
        <QdtComponent class="w-full" type="QdtViz" :props="map" />
      </Square>
      <Square 
        ref="v-table" 
        name="Table"
        class="w-full mb-4" color="tint" tight>
        <QdtComponent 
          class="w-full"
          type="QdtViz" 
          :props="table"
          />
      </Square>
      <Square 
        ref="v-points" 
        name="Points"
        class="w-full mb-4" color="transparent" tight>
        <QdtComponent 
          class="w-full"
          type="QdtViz" 
          :props="points"
          />
        <div class="w-full flex flex-row justify-center">
          <ButtonGroup
            :options="{
              'domain': 'Domain',
              'metric': 'All Metrics',
              }"
            @buttonClicked="handleLevelSelection($event.id, $event.value)" 
            />
        </div>
      </Square>
      
    </div>
  </div>
</template>

<script>
import QdtComponent from '~sdp-components/Qdt/QdtComponent'
import QlikFilter from '~sdp-components/Qlik/QlikFilter'
import QlikFiltersCollapsable from '~sdp-components/Qlik/QlikFiltersCollapsable'
import QlikKPI from '~sdp-components/Qlik/QlikKPI'
import Square from '~sdp-components/PageElements/Square'
import ButtonGroup from '~sdp-components/PageElements/ButtonGroup'
import ScrollSpyNav from '~sdp-components/Navigation/ScrollSpyNav'

export default {
  layout: 'main',
  components: {
    QdtComponent,
    QlikFilter,
    QlikFiltersCollapsable,
    QlikKPI,
    Square,
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
        id: 'c0911370-79b9-49e4-8397-2a4a18c929af', type: 'extension', height: '400px',
      },
      table: {
        id: 'BSXpST', type: 'table', height: '600px'
      },
      points: {
        id: 'HrDKVU', type: 'extension', height:'400px',
      },
    }
  },
  methods: {
    // handleDomainSelected (values) {
    //   const selected = values.filter(val => val.isSelected)
    //   if (selected.length) {
    //     this.selectedDomain = selected[0].text
    //   } else {
    //     this.selectedDomain = ""
    //   }
    // },

    handleLevelSelection (id, name) {
      if (id == 'domain') {
        this.$set(this.points, "id", "HrDKVU")
      } else if (id == 'metric') {
        this.$set(this.points, "id", "HGmXP")
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