<template>
  <section>
    <Columns>
      <Column side="left" width="1/3">
        <Square color="dark">
          <Heading size="large">School Progress Report</Heading>
          <p> For the {{ $store.state.SY_C }} school year</p>
        </Square>
        <Square color="tint">
          <!-- <div ref="qdtSelectionToolbar"/> -->
          <QlikFiltersCollapsable 
            :qlikAPI="$qlik"
            :fieldValues="[
              {field:'SPR Report Type'},
              {field:'Sector'},               
              {field:'Learning Network', title:'Network'},
            ]" />     
          <QlikFilter 
            :qlikAPI="$qlik"
            style="max-height: 400px"
            title="School Name and Report Type"
            field="School Name (Reporting Category)" 
            @changed="update" />                   
        </Square>
      </Column>
      <Column side="right" width="2/3">
        <div class="flex flex-wrap mb-4" color="transparent">
          <QlikKPI 
            :qlikAPI="$qlik"
            class="max-w-sm"
            ref="kpi1"
            :qId="kpi1.props.qId"
            :title="kpi1.props.title" 
            :subtitle="kpi1.props.subtitle"
            :secondaryLabel="kpi1.props.secondaryLabel" 
            :description="kpi1.props.description" />
          <QdtComponent :qdtAPI="$qdt" :type="chart1.type" :props="chart1.props" />
        </div>
        <div class="flex flex-wrap mb-4" color="transparent">
          <!-- <QdtComponent class="w-1/2" :type="kpi2.type" :props="kpi2.props" /> -->
          <QlikKPI 
            :qlikAPI="$qlik"
            class="max-w-sm"
            :qId="kpi2.props.qId"
            :title="kpi2.props.title" 
            :subtitle="kpi2.props.subtitle"
            :secondaryLabel="kpi2.props.secondaryLabel" 
            :description="kpi2.props.description" />
          <QdtComponent :qdtAPI="$qdt" :type="chart2.type" :props="chart2.props" />
        </div>
        <div class="flex flex-wrap mb-4" color="transparent">
          <!-- <QdtComponent class="w-1/2" :type="kpi3.type" :props="kpi3.props" /> -->
          <QlikKPI 
            :qlikAPI="$qlik"
            class="max-w-sm"
            :qId="kpi3.props.qId"
            :title="kpi3.props.title" 
            :subtitle="kpi3.props.subtitle"
            :secondaryLabel="kpi3.props.secondaryLabel" 
            :description="kpi3.props.description" />
          <QdtComponent :qdtAPI="$qdt" :type="chart3.type" :props="chart3.props" />
        </div>
        <div class="flex flex-wrap mb-4" color="transparent">
          <!-- <QdtComponent class="w-1/2" :type="kpi4.type" :props="kpi4.props" /> -->
          <QlikKPI 
            :qlikAPI="$qlik"
            class="max-w-sm"
            :qId="kpi4.props.qId"
            :title="kpi4.props.title" 
            :subtitle="kpi4.props.subtitle"
            :secondaryLabel="kpi4.props.secondaryLabel" 
            :description="kpi4.props.description" />
          <QdtComponent :qdtAPI="$qdt" :type="chart4.type" :props="chart4.props" />
        </div>
      </Column>
    </Columns> 
  </section>  
</template>

<script>
import { mapState } from 'vuex'
// import QdtFilters from '~/components/Qdt/QdtFilters.vue'
import QdtComponent from '~components/Qdt/QdtComponent.vue'
import QlikFiltersCollapsable from '~components/Qlik/QlikFiltersCollapsable.vue'
import QlikFilter from '~components/Qlik/QlikFilter.vue'
import QlikKPI from '~components/Qlik/QlikKPI.vue'
import Horizontal from '~components/PageElements/Horizontal.vue'
import Columns from '~components/PageElements/Columns.vue'
import Column from '~components/PageElements/Column.vue'
import Square from '~components/PageElements/Square.vue'
import Heading from '~components/PageElements/Heading'
// import SearchResultsList from '~components/Search/SearchResultsListQlik.vue'

export default {
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
          'title': '% Earned Overall', 
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
          'title': 'Average of Past Three % Earned Overall', 
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
          'title': '% "Model" and "Reinforce" School Reports', 
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
          'title': '% of Students in "Model" and "Reinforce" Schools', 
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
    update() {
      // console.log("update kp1", this.$refs.kpi1)
      // this.$refs.kpi1.update()
    }
  },
  async mounted() {
    this.$store.state.qdtComponents.render("QdtSelectionToolbar", {title: "Selections", btnText: "Clear"}, this.$refs.qdtSelectionToolbar)
    // this.$store.state.qdtComponents.render("QdtFilter", {cols: ['School Name (Reporting Category)'], expanded: true}, this.$refs.qdtFilter)
    // const engine = await this.$store.state.qdtComponents.qDocPromise
    // const sess = await engine.createSessionObject(qDef)  
    // const f = async () => {
    //   const _layout = await sess.getLayout() 
    //   console.log("List item callback", _layout)
    // }
    // sess.on("changed", f)
    // const layout = await sess.getLayout()      
    // console.log("List item init", layout, sess)

  },
  
}
</script>

<style>
  .bold {
    font-weight: bold
  }
</style>

