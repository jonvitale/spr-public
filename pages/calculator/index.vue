<template>
  <div>
    <Square color="dark">
      <Heading size="large">Select a School and Report Type </Heading>
    </Square>
    <Square color="tint">  
      <div ref="search" 
        v-if="slugReports.length > 5"
        class="inline-flex justify-between w-full mb-4 bg-white appearance-none border border-blue-900  py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
        <div class="inline-flex">
          <SearchIcon />
          <input 
            class="pl-2 text-blue-900 w-full"
            id="search-filter" 
            type="text" 
            placeholder=""
            v-model="searchText" />
        </div>
        <ClearIcon v-if="searchText.length > 0"
          class="flex-initial"
          @click="searchText = ''" 
        />
      </div>    
      <div v-for="slugReport in slugReports" :key="slugReport">
        <nuxt-link
          v-if="searchForSchoolBySlugReport(searchText, slugReport)"
          :to="'/calculator/' + slugReport "
          class="inline-block w-full text-left text-blue-800 font-bold uppercase border-b border-blue-400 rounded uppercase border-transparent border-b-2 rounded-b-none py-2 pl-2 focus:outline-none hover:bg-gray-200"  
          >
          {{ lookupSchoolReportBySlugReport(slugReport) }}
        </nuxt-link>
         <!-- {{ lookupSchoolReportBySlugReport(slugReport) }} -->
      </div>
    </Square>
  </div>
</template>
<script>
import NavigationItem from '~sdp-components/Navigation/NavigationItem'
import Square from '~sdp-components/PageElements/Square'
import Heading from '~sdp-components/PageElements/Heading'
import SearchIcon from '~sdp-components/Icons/SearchIcon'
import ClearIcon from '~sdp-components/Icons/ClearIcon'

export default {
  components: {
    NavigationItem,
    Square,
    Heading,
    SearchIcon,
    ClearIcon,
  },
  data: function(){
    return {
      searchText: "",
      slugReports: [],
      slugToSchoolMap: null,
    }
  },
  methods: {
    lookupSchoolReportBySlugReport(slugReport) {
      if (this.slugToSchoolMap) {
        const schoolReport = this.slugToSchoolMap[slugReport.toLowerCase()]
        // console.log("lookupSchoolReportBySlugReport", slugReport, schoolReport)
        return schoolReport
      } else {
        return null
      }
    },
    searchForSchoolBySlugReport(searchText, slugReport) {
      if (this.slugToSchoolMap) {
        const schoolReport = this.lookupSchoolReportBySlugReport(slugReport)
        return schoolReport.toLowerCase().includes(searchText.toLowerCase())
      } else {
        return null
      }
    }
  }, 
  async created() {
    this.slugReports = this.$store.state.schools.list.slugReport.map(val => val.text)
    let slugToSchoolMap = {}
    let i, slugReport, schoolReport
    for (i in this.slugReports) {
      slugReport = this.slugReports[i]
      schoolReport = await this.$store.dispatch("schools/lookup_text_by_slugreport", {
        slugReport: slugReport, 
        target: "schoolReport"
      })
      slugToSchoolMap[slugReport] = schoolReport
    }
    this.slugToSchoolMap = slugToSchoolMap
  }
}
</script>