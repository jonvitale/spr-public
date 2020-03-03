<template>
  <section>
    <Columns>
      <Column side="left" width="1/3">
          <Square color="dark">
            <Heading size="large">School Progress Report</Heading>
            <p> For the {{ $store.state.SY_C }} school year</p>
          </Square>
          <Square color="tint">             
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
        <div class="flex flex-wrap">
          <QdtComponent :qdtAPI="$qdt" :type="sankey.type" :props="sankey.props" />
          <QdtComponent :qdtAPI="$qdt" :type="table.type" :props="table.props" />
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
      sankey: {
        'type': 'QdtViz',
        'props': {id: 'b38403aa-c472-4566-9b81-3eb374866388', type: 'extension', width:'800px', height: '600px'} 
      },
      table: {
        'type': 'QdtViz',
        'props': {id: 'a1196e2b-acc2-4831-9f05-8b57ae22a0a9', type: 'table', width:'800px', height: '600px'}
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
    
  }
}
</script>