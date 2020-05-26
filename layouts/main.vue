<template>
  <div>
    <div class="container mx-auto px-2 lg:px-6 py-4 md:py-6">
      <Header/>
      <br>
      <Navigation />
      <br>
      <Columns>
        <Column side="left" width="1/3">
          <Square color="dark">
            <Heading size="large">School Progress Report</Heading>
            <p> For the {{ $store.state.SY_C }} school year</p>
          </Square>
          <Square color="tint" class="sticky top-0">
            <QlikFilter 
              class="mt-2"              
              title="Select a specific Domain"
              field="Domain_Name"
              preventSortByState
              preventMultipleSelections
              @change="handleFieldSelections" 
              />        
            <QlikFilter 
              v-if="$store.getters['selections/oneDomainSelected']"
              class="mt-2"       
              style="max-height: 360px"       
              :title="'Select a specific ' + selectedDomain + ' Metric'"
              field="Metric_Name"
              preventMultipleSelections
              :expression="'Only({<[Domain_Name]={\''+ selectedDomain + '\'}]>}[Metric_Name])'"
              @change="handleFieldSelections" 
              />   
          
            <QlikFiltersCollapsable 
              :fieldValues="[
                {field:'SPR Report Type'},
                {field:'Sector'},               
                {field:'Learning Network', title:'Network'},
              ]" 
              :blacklistFields="['School Name (Reporting Category)', 'Domain_Name']"
              @change="handleSelections" 
              />     
            <QlikFilter 
              style="max-height: 400px"
              title="School Name and Report Type"
              field="School Name (Reporting Category)" 
              @change="handleFieldSelections"  
              />                   
          </Square>
        </Column>
        <Column side="right" width="2/3">
          <Nuxt/>
        </Column>
      </Columns>
    </div>
    <Footer/>
  </div>
</template>

<script>
import SelectionsMixin from '~/mixins/SelectionsMixin'
import Header from '~sdp-components/Header/Header'
import Navigation from '~/components/Navigation'
import Footer from '~sdp-components/Footer/Footer'
import Columns from '~sdp-components/PageElements/Columns'
import Column from '~sdp-components/PageElements/Column'
import QlikFiltersCollapsable from '~sdp-components/Qlik/QlikFiltersCollapsable'
import QlikFilter from '~sdp-components/Qlik/QlikFilter'
import Square from '~sdp-components/PageElements/Square'
import Heading from '~sdp-components/PageElements/Heading'

export default {
  mixins: [ SelectionsMixin ],
  components: {
    Header,
    Navigation,
    Footer,
    Columns,
    Column,
    QlikFilter,
    QlikFiltersCollapsable,
    Square,
    Heading,
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
