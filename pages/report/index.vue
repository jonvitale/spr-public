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
          <SVGSearch />
          <input 
            class="pl-2 text-blue-900 w-full"
            id="search-filter" 
            type="text" 
            placeholder=""
            v-model="searchText" />
        </div>
        <SVGClear v-if="searchText.length > 0"
          class="flex-initial"
          @click="searchText = ''" 
        />
      </div>    
      <div v-for="slug_report in slugReports" :key="slug_report">
        <nuxt-link
          v-if="lookupSchoolReportBySlugReport(slug_report).toLowerCase()
                .includes(searchText.toLowerCase())"
          :to="'/report/' + slug_report "
          class="inline-block w-full text-left text-blue-800 font-bold uppercase border-b border-blue-400 rounded uppercase border-transparent border-b-2 rounded-b-none py-2 pl-2 focus:outline-none hover:bg-gray-200"  
          >
          {{ lookupSchoolReportBySlugReport(slug_report) }}
        </nuxt-link>
      </div>
    </Square>
  </div>
</template>
<script>
import NavigationItem from '~components/Navigation/NavigationItem.vue'
import Square from '~components/PageElements/Square.vue'
import Heading from '~components/PageElements/Heading.vue'
import SVGSearch from '~components/SVG/SVGSearch.vue'
import SVGClear from '~components/SVG/SVGClear'

export default {
  components: {
    NavigationItem,
    Square,
    Heading,
    SVGSearch,
    SVGClear,
  },
  data: function(){
    return {
      searchText: "",
    }
  },
  computed: {
    slugReports() {
      try {
        const vals = this.$store.state.schools.list.slug_report.map(val => val.text)
        return vals
      } catch (e) {
        return []
      }
    },
    lookupSchoolReportBySlugReport() {
      return (slug_report)  => {
        return this.$store.getters["schools/lookupTextBySlugReport"](slug_report, "school_report")
      }
    }
  }
}
</script>