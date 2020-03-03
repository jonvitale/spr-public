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
              @changed="domainSelected" 
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
      <Column side="right" width="2/3">
        <div>
          <QdtComponent :qdtAPI="$qdt" :type="map.type" :props="map.props" />
        </div>
      </Column>
    </Columns>
  </section>
</template>

<script>
import QdtComponent from '~components/Qdt/QdtComponent.vue'
import QlikFilter from '~components/Qlik/QlikFilter.vue'
import QlikFiltersCollapsable from '~components/Qlik/QlikFiltersCollapsable.vue'
import QlikKPI from '~components/Qlik/QlikKPI.vue'
import Horizontal from '~components/PageElements/Horizontal.vue'
import Columns from '~components/PageElements/Columns.vue'
import Column from '~components/PageElements/Column.vue'
import Square from '~components/PageElements/Square.vue'
import Heading from '~components/PageElements/Heading'

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
  },
  data: function() { 
    return {
      selectedDomain: '',
      map: {
        'type': 'QdtViz',
        'props': {id: 'jKmNJ', type: 'extension', height: '900px'} 
      }
    }
  },
  methods: {
    domainSelected(values) {
      const selected = values.filter(val => val.isSelected)
      if (selected.length) {
        this.selectedDomain = selected[0].text
      } else {
        this.selectedDomain = ""
      }
    }
  },
  
  /**
   * Remove field values that we don't want to carry to other pages
   */  
  async destroyed() {    
    const fieldsToClear = ["Metric_Name", "Domain_Name"]
    const engine = await this.$store.state.qdtComponents.qDocPromise   
    let field
    fieldsToClear.forEach(async fieldName => {
      field = await engine.getField(fieldName)
      await field.clear()
    })
  }
}
</script>