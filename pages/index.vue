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
            @changed="handleFieldSelections" 
            />        
          <QlikFiltersCollapsable 
            :qlikAPI="$qlik"
            :fieldValues="[
              {field:'SPR Report Type'},
              {field:'Sector'},               
              {field:'Learning Network', title:'Network'},
            ]" 
            @changed="handleFieldSelections" 
            />     
          <QlikFilter 
            :qlikAPI="$qlik"
            style="max-height: 400px"
            title="School Name and Report Type"
            field="School Name (Reporting Category)" 
            @changed="handleFieldSelections"  
            />                   
        </Square>
      </Column>
      <Column side="right" width="2/3">
        <Square class="flex flex-wrap mb-4" color="light" tight>
          <QlikKPI 
            class="max-w-sm"
            ref="kpi1"
            :qId="kpi1.props.qId"
            :title="kpi1.props.title" 
            :subtitle="kpi1.props.subtitle"
            :secondaryLabel="kpi1.props.secondaryLabel" 
            :description="kpi1.props.description" 
            />
          <QdtComponent class="flex-auto m-2 p-2 bg-white" :type="chart1.type" :props="chart1.props" />
        </Square>
        <Square class="flex flex-wrap mb-4" color="light" tight>
          <QlikKPI 
            class="max-w-sm"
            :qId="kpi2.props.qId"
            :title="kpi2.props.title" 
            :subtitle="kpi2.props.subtitle"
            :secondaryLabel="kpi2.props.secondaryLabel" 
            :description="kpi2.props.description" 
            />
          <QdtComponent class="flex-auto m-2 p-2 bg-white" :type="chart2.type" :props="chart2.props" />
        </Square>
        <Square v-if="!$store.getters['selections/oneSchoolSelected']"
          class="flex flex-wrap mb-4" color="light" tight>
          <QlikKPI 
            class="max-w-sm"
            :qId="kpi3.props.qId"
            :title="kpi3.props.title" 
            :subtitle="kpi3.props.subtitle"
            :secondaryLabel="kpi3.props.secondaryLabel" 
            :description="kpi3.props.description" />
          <QdtComponent class="flex-auto m-2 p-2 bg-white" :type="chart3.type" :props="chart3.props" />
        </Square>
        <Square v-if="!$store.getters['selections/oneSchoolSelected']"
          class="flex flex-wrap mb-4" color="light" tight>
          <QlikKPI 
            class="max-w-sm"
            :qId="kpi4.props.qId"
            :title="kpi4.props.title" 
            :subtitle="kpi4.props.subtitle"
            :secondaryLabel="kpi4.props.secondaryLabel" 
            :description="kpi4.props.description" />
          <QdtComponent class="flex-auto m-2 p-2 bg-white" :type="chart4.type" :props="chart4.props" />
        </Square>
      </Column>
    </Columns> 
  </section>  
</template>

<script>
import { mapState } from 'vuex'
import SelectionsMixin from '~/mixins/SelectionsMixin'
import QdtComponent from '~sdp-components/Qdt/QdtComponent'
import QlikFiltersCollapsable from '~sdp-components/Qlik/QlikFiltersCollapsable'
import QlikFilter from '~sdp-components/Qlik/QlikFilter'
import QlikKPI from '~sdp-components/Qlik/QlikKPI'
import Horizontal from '~sdp-components/PageElements/Horizontal'
import Columns from '~sdp-components/PageElements/Columns'
import Column from '~sdp-components/PageElements/Column'
import Square from '~sdp-components/PageElements/Square'
import Heading from '~sdp-components/PageElements/Heading'
// import SearchResultsList from '~sdp-components/Search/SearchResultsListQlik'

export default {
  mixins: [ SelectionsMixin ],
  components: {
    QlikFilter,
    QlikFiltersCollapsable,
    // QdtFilters,
    QdtComponent,
    QlikKPI,
    Columns,
    Column,
    Square,
    Horizontal,
    Heading,
    // SearchResultsList,
  },
  data: function() {
    return {
      filterFields: ['School Name (Reporting Category)'],
      filters: {
        'type': 'QdtViz',
        'props': {
          'id': '45cb0d85-ddbb-4d21-9339-b369aa97420a',
          'height': '600px',
        }
      },
      kpi1: {
        'type': 'kpi',
        'props': {
          'qId': 'bJYMhp',
          'description':'Averaged for all applicable district and charter schools', 
          'title': '', 
          'subtitle': ' ',
          'secondaryLabel': 'From  ' + this.$store.state.SY_P,
          'color': 'light'
        }
      },
      kpi2: {
        'type': 'kpi',
        'props': {
          'qId': 'ghWAbL',
          'description':'Average of previous three reports, averaged for all applicable district and charter schools', 
          'title': '', 
          'subtitle': ' ',
          'secondaryLabel': 'From  ' + this.$store.state.SY_P,
          'color': 'light'
        }
      },
      kpi3: {
        'type': 'kpi',
        'props': {
          'qId': 'hGwBh',
          'description':'Averaged for all applicable district and charter schools', 
          'title': '', 
          'subtitle': ' ',
          'secondaryLabel': 'From  ' + this.$store.state.SY_P,
          'color': 'light'
        }
      },
      kpi4: {
        'type': 'kpi',
        'props': {
          'qId': 'kcmZvgT',
          'description':'Averaged for students at all applicable district and charter schools', 
          'title': '', 
          'subtitle': ' ',
          'secondaryLabel': 'From  ' + this.$store.state.SY_P,
          'color': 'light'
        }
      },
      chart1: {
        'type': 'QdtViz',
        'props': {id: 'uShJQ', type: 'comboLineBarchart', height: '300px'} 
      },
      chart2: {
        'type': 'QdtViz',
        'props': {id: 'xvbQB', type: 'lineChart', height: '300px'} 
      },
      chart3: {
        'type': 'QdtViz',
        'props': {id: 'cQeEbS', type: 'comboLineBarchart', height: '300px'} 
      },
      chart4: {
        'type': 'QdtViz',
        'props': {id: 'Meftc', type: 'comboLineBarchart', height: '300px'} 
      },
    }
  },
  
  methods: {
    
  },
  async mounted() {
    // this.$qdt.render("QdtSelectionToolbar", {title: "Selections", btnText: "Clear"}, this.$refs.qdtSelectionToolbar)
    
    // this.$qdt.render("QdtFilter", {cols: ['School Name (Reporting Category)'], expanded: true}, this.$refs.qdtFilter)
    
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

<style>
  .bold {
    font-weight: bold
  }
</style>

