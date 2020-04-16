<template>
  <div>
    <Columns>
      <!-- left side: overall and domain scores -->
      <Column side="left" width="1/3">    
        <div class="text-left sticky top-0">
          <div class="flex flex-col align-middle lg:py-4">
            <Square color="tint" tight class="py-6 mb-6">
              <h5 class="w-full text-center"> 
                Performance Tiers Color Key 
              </h5>
              <div class="flex flex-row flex-wrap justify-between">   
                <div class="spr-intervene text-center px-2">
                  <h6> Intervene </h6>
                  <p> 0-24% </p>
                </div>             
                <div class="spr-watch text-center px-2">
                  <h6> Watch </h6>
                  <p> 25-49% </p>
                </div>                
                <div class="spr-reinforce text-center px-2">
                  <h6> Reinforce </h6>
                  <p> 50-74% </p>
                </div>
                <div class="spr-model text-center">
                  <h6> Model </h6>
                  <p> 75-100% </p>
                </div>                
              </div>
            </Square>
            <Square color="tint">
              <h3 class="w-full text-center"> Scores </h3>
              <div v-for="domain in domainFacts" :key="domain.key"> 
                <div v-if="domain.key !== 'ee' && (domain.key !== 'cc' || reportName === 'High School')">
                  <div class="flex flex-row justify-between">
                    <h4> {{ domain.title }} </h4>
                    <button> Reset </button>
                  </div>
                  <div class="flex flex-row justify-between">
                    <KPI :ref="'kpi-agg-current-'+domain.key"
                      class="mr-2"
                      style="width: 11rem; height: 7rem;"
                      align="right"
                      tight
                      :color="getSPRTierByValue($qlik.lookupValueByFieldValue(metricValues, 'metricId', domain.metricId, 'percEarned', false, 'text'))"
                      title="Current"
                      :primary="formatValue($qlik.lookupValueByFieldValue(metricValues, 'metricId', domain.metricId, 'percEarned', false, 'number'), true, true)"
                      :description="
                        formatValue($qlik.lookupValueByFieldValue(metricValues, 'metricId', domain.metricId, 'pointsEarned', false, 'number'), false)
                        + ' out of ' +
                        formatValue($qlik.lookupValueByFieldValue(metricValues, 'metricId', domain.metricId, 'possiblePoints', false, 'number'), false)
                        "
                      />
                    <KPI :ref="'kpi-agg-projected-'+domain.key"
                      class="mr-2"
                      style="width: 11rem; height: 7rem;"
                      align="right"
                      tight
                      :color="getSPRTierByValue(getProjectedValue(domain.metricId, 'percEarnedProjected'))"
                      title="Projected"
                      :primary="formatValue(getProjectedValue(domain.metricId, 'percEarnedProjected'), true, true)"
                      :description="
                        formatValue(getProjectedValue(domain.metricId, 'pointsEarnedProjected'), false)
                        + ' out of ' +
                        formatValue(getProjectedValue(domain.metricId, 'possiblePointsProjected'), false)
                        "
                      />
                  </div>
                </div>
              </div>              
            </Square>
          </div>
        </div>
      </Column>
      
      <!-- right side: individual metric scores and projection sliders -->
      <Column side="right" width="2/3">
        <!-- header above sliders -->
        <div class="sticky">
          <!-- domain buttons -->
          <div class="flex flex-row justify-between">
            <button 
              class="domain-nav-item"
              :class="{'active': currentDomain == 'Achievement'}"
              @click="updateCurrentDomain('Achievement')"
              > Achievement </button>
            <button 
              class="domain-nav-item"
              :class="{'active': currentDomain == 'Progress'}"
              @click="updateCurrentDomain('Progress')"
              > Progress </button>
            <button 
              class="domain-nav-item"
              :class="{'active': currentDomain == 'Climate'}"
              @click="updateCurrentDomain('Climate')"
              > Climate </button>
            <button 
              class="domain-nav-item"
              :class="{'active': currentDomain == 'College & Career'}"
              @click="updateCurrentDomain('College & Career')"
              > College &amp; Career </button>
          </div>
          &nbsp;
          <!-- column titles -->
          <div class="flex flex-row">
            <div class="w-full lg:w-1/2">
              <h6> Scored Range and Metric Score </h6>
            </div>
            <div class="flex w-full lg:w-1/2">
              <h6 class="w-2/5 mr-2 text-center"> Current Points </h6>
              <h6 class="w-2/5 mr-2 text-center"> Projected Points </h6>
              <h6 class="w-1/5 text-center"> Projected Change </h6>
            </div>
          </div>
        </div
        >
        <!--  Projected Metric Sliders and KPIs-->
        <div v-for="metricId in metricIds" :key="metricId">
          <div class="flex flex-row flex-wrap mb-2 bg-gray-200"
            v-if="
              isApplicableByMetricId(metricId) && 
              $qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'possiblePoints', false, 'number') > 0
              "
            >
            <div class="w-full lg:w-1/2">
              <h6 class="p-1"> 
                {{$qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'metricName', false, 'text') }} 
              </h6>
              <!--  -->
              <!-- Note: we only update the metric on input (every movement), but do all rollups on change -->
              <ProjectionSlider
                style="min-width:300px; max-width:600px; min-height:4rem;"
                class="w-full"
                :ref="'slider-projected-'+metricId"
                :referenceValue="$qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'score', false, 'number')"
                :floor="$qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'floorPoints', false, 'number') / 100"
                :ceiling="$qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'targetPoints', false, 'number') / 100"
                :min="$qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'isAgi', false, 'number') ? -10 : 0"
                :max="$qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'isAgi', false, 'number') ? 10 : 1"
                :is-percent="$qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'isAgi', false, 'number') != 1"
                @change="updateProjectedValuesByMetric(metricId, $event, true)"
                @input="updateProjectedValuesByMetric(metricId, $event, true)"
              />
              
                
              <div class="flex justify-center">
                <button @click="resetProjectedMetric(metricId)"> Reset </button>
              </div>
            </div>
            <div class="flex flex-row w-full lg:w-1/2">
              <KPI :ref="'kpi-current-'+metricId"
                class="w-2/5 mr-2"
                style="height: 7rem;"
                align="right"
                tight
                :color="getSPRTierByValue($qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'percEarned', false, 'text'))"
                title="Current"
                :primary="formatValue($qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'percEarned', false, 'number'), true, true)"
                :description="
                  formatValue($qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'pointsEarned', false, 'number'), false)
                  + ' out of ' +
                  formatValue($qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'possiblePoints', false, 'number'), false)
                  "
                />
              <KPI :ref="'kpi-projected-'+metricId"
                class="w-2/5 mr-2"
                style="height: 7rem;"
                align="right"
                tight
                :color="getSPRTierByValue(getProjectedValue(metricId, 'percEarnedProjected'))"
                title="Projected"
                :primary="formatValue(getProjectedValue(metricId, 'percEarnedProjected'), true, true)"
                :description="
                  formatValue(getProjectedValue(metricId, 'pointsEarnedProjected'), false)
                  + ' out of ' +
                  formatValue(getProjectedValue(metricId, 'possiblePointsProjected'), false)
                  "
                />
              <div class="w-1/5 flex justify-center items-center text-3xl bg-gray-400"
                :class="
                  (
                    getProjectedValue(metricId, 'percEarnedProjected')
                    -
                    $qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'percEarned', false, 'number')) 
                    >= 0 ?
                    'text-blue-600' :
                    'text-red-600'"
                style="height: 7rem;"
                >
                <span>
                  {{ 
                    (
                      getProjectedValue(metricId, 'percEarnedProjected') 
                      - 
                      $qlik.lookupValueByFieldValue(metricValues, 'metricId', metricId, 'percEarned', false, 'number')
                    )
                  | formatValue(true, true, true)
                  }} 
                </span>
              </div>
            </div>
          </div>
        </div>
      </Column>
    </Columns>
  </div>
</template>

<script>
import metricValuesDef from '~/definitions/calculatorMeasures'

import ProjectionSlider from '~sdp-components/PageElements/ProjectionSlider'
import KPI from '~sdp-components/PageElements/KPI'
import Columns from '~sdp-components/PageElements/Columns'
import Column from '~sdp-components/PageElements/Column'
import Square from '~sdp-components/PageElements/Square'

const formatValue = (value, isPercent, roundAtWhole, showPlusForPositive) => {
      let prepend = ''
      if (showPlusForPositive && value > 0) {
        prepend = "+"
      }

      if(isPercent) {
        if (roundAtWhole) {
          return prepend + "" + Math.round(value * 100) + '%'
        } else {
          return prepend + "" + Math.round(value * 10000) / 100 + '%'
        }        
      } else {
        if (roundAtWhole) {
           return prepend + "" + Math.round(value)
        } else {
          return prepend + "" + Math.round(value * 100) / 100
        }
      }
    }

const domainFacts = [
  {
    key: 'overall',
    title: 'Overall',
    metricId: 'Z_OVERALL_OVERALL',
    description: 'A school’s overall score represents its combined performance on the Achievement, Progress, Climate, and College & Career (for high schools only) domains.',
  },
  {
    key: 'achievement',
    title: 'Achievement',
    metricId: 'Z_ACH_OVERALL',
    description: 'The Achievement domain measures performance on standardized assessments, including PSSA, Keystone Exams, ACCESS for ELLs, and reading assessments.',
  },
  {
    key: 'progress',
    title: 'Progress',
    metricId: 'Z_PROG_OVERALL',
    description: 'The Progress domain measures growth on standardized assessments and progress towards graduation (for high schools only).',
  },
  {
    key: 'climate',
    title: 'Climate',
    metricId: 'Z_CLIM_OVERALL',
    description: 'The Climate domain measures school climate and student and parent/guardian engagement.',
  },
  {
    key: 'cc',
    title: 'College & Career',
    title_style: {fontSize: '16pt', fontWeight: 700},
    metricId: 'Z_CC_OVERALL',
    description: 'The College & Career domain measures college and career readiness and post-secondary outcomes.',
  },
  {
    key: 'ee',
    title: 'Educator Effectiveness',
  }
]

export default {
  components: {
    Columns,
    Column,
    Square,
    KPI,
    ProjectionSlider,
  },
  data() {
    return {
      currentDomain: "Achievement",
      domainFacts: domainFacts,
      sessionObject: null,
      schoolsInitialized: this.$store.state.schools.initialized,
      slugReport: this.$route.params.slug_report,
      metricIds: null,
      metricValues: null,
      // general facts about the school
      metricId: '', 
      srcschoolid: '',
      schoolName: '',
      reportName: '',
      // keep projection values directly in key-value objects
      // this will make it easier to update the view
      scoreProjected: null,
      percEarnedProjected: null,
      pointsEarnedProjected: null,
      pointsEarnedProjectedCalculated: null,
      possiblePointsProjected: null,        
    }
  },
  
  watch: {
    schoolsInitialized(to, from) {
      if (to && !from) {
        this.initialize()
      }
    }
  },

  methods: {
    async destroy() {        
      if (this.sessionObject) {
        this.sessionObject.removeListener("changed", this.update)
        this.$qlik.destroySessionObject(this.sessionObject)
      }
    },

    getProjectedValue (metricId, type) {
      // has this been initialized
      if (this.percEarnedProjected != null && 
          Object.keys(this.percEarnedProjected).length > 0
        ) {
        if (type == "scoreProjected") {
          return this.scoreProjected[metricId]
        } else if (type == "percEarnedProjected") {
          return this.percEarnedProjected[metricId]
        } else if (type == "pointsEarnedProjected") {
          return this.pointsEarnedProjected[metricId]
        } else if (type == "pointsEarnedProjectedCalculated") {
          return this.pointsEarnedProjectedCalculated[metricId]
        } else if (type == "possiblePointsProjected") {
          return this.possiblePointsProjected[metricId]
        } else {
          return null
        }
      } else {
        return null
      }
    },

    getSPRColorByValue (textVal) {
      let val
      if (typeof textVal == "string") {
        val = parseFloat(textVal)
      } else {
        val = textVal
        val = 100 * val
      }
      // console.log("this val for color", val, textVal)
      if (val < 25) { return '#c0504d' }
      else if (val < 50) { return "#f79646" }
      else if (val < 75) { return "#00b050" }
      else if (val >= 75) { return "#0070c0" }
      else { return "#888888" }
    },

    getSPRTierByValue (textVal) {
      let val
      if (typeof textVal == "string") {
        val = parseFloat(textVal)
      } else {
        val = textVal
        val = 100 * val
      }
      // console.log("this val for tier", val, textVal)
      if (val < 25) { return 'Intervene' }
      else if (val < 50) { return "Watch" }
      else if (val < 75) { return "Reinforce" }
      else if (val >= 75) { return "Model" }
      else { return null }
    },

    /** 
     * initialize grabs the school's slug from the route param to use as this pages school.
     * We then get the full name of the school - and report type - from the slug.
     * Then select the school in the field to update the line graphs
     * Then get the measures from the metricValues hypermetricValues def
     * initialized depends upon the school list being loaded, so we must only call that when schools/initialized is true in vuex 
    */
    async initialize() {
      this.sessionObject = await this.$qlik.generateHypercubeObjectFromDef(metricValuesDef)
      this.sessionObject.on("changed", this.update)
      
      this.schoolReport = await this.$store.dispatch("schools/lookup_text_by_slugreport", { slugReport: this.slugReport, target: "schoolReport"})
      this.srcschoolid = await this.$store.dispatch("schools/lookup_text_by_slugreport", { slugReport: this.slugReport, target: "srcschoolid"})
      this.schoolName = await this.$store.dispatch("schools/lookup_text_by_slugreport", { slugReport: this.slugReport, target: "schoolName"})
      this.reportName = await this.$store.dispatch("schools/lookup_text_by_slugreport", { slugReport: this.slugReport, target: "reportName"})
    
      
      let selectedValues = {}
      selectedValues["schoolReport"] = await this.$qlik.selectFieldValues("School Name (Reporting Category)", [{text: this.schoolReport}])
      await this.$store.dispatch("update_current_selections", selectedValues)
      
      this.update()
    },

    isApplicableByMetricId (metricId) {
      if (this.metricValues) {
        const values = this.$qlik.lookupValueByFieldValue(this.metricValues, "metricId", metricId, "exception")
        if (values && values.number) {
          return values.number !== 999
        } else {
          return true
        }
      } else {
        return null
      }
    },

    lookupTextByFieldValue (sourceField, sourceFieldValue, targetField, returnMultiple) {
      if (this.metricValues) {
        const values = this.$qlik.lookupValueByFieldValue(this.metricValues, sourceField, sourceFieldValue, targetField, returnMultiple)        
        if (returnMultiple) {
          return values.map(v => v.text)
        } else if (values && values.text) {
          return values.text
        } else {
          return ''
        }
      } else {
        return ''
      }
    },

    lookupTextByMultipleFieldValues (sourceFieldValueMap, targetField, returnMultiple) {
      if (this.metricValues) {
        const values = this.$qlik.lookupValueByMultipleFieldValues(this.metricValues, sourceFieldValueMap, targetField, returnMultiple)        
        if (returnMultiple) {
          return values.map(v => v.text)
        } else if (values && values.text) {
          return values.text
        } else {
          return ''
        }
      } else {
        return ''
      }
    },

    lookupNumberByFieldValue (sourceField, sourceFieldValue, targetField, returnMultiple) {
      if (this.metricValues) {
        const values = this.$qlik.lookupValueByFieldValue(this.metricValues, sourceField, sourceFieldValue, targetField, returnMultiple)
        if (returnMultiple) {
          return values.map(v => v.number)
        } else if (values && values.number) {
          return values.number
        } else {
          return null
        }
      } else {
        return null
      }
    },

    
    

    async update() {
      if (this.sessionObject) {
        this.metricValues = await this.$qlik.getValuesFromHypercubeObject(this.sessionObject)
        this.metricIds = await this.$qlik.lookupValueByMultipleFieldValues(this.metricValues, {'domain_name': this.currentDomain, 'is_metric': true}, 'metricId', true, 'text')
        
        // add a deep copy of the score field as projected scores
        this.scoreProjected = new Array(this.metricValues['metricId'].length)
        this.percEarnedProjected = new Array(this.metricValues['metricId'].length)
        this.pointsEarnedProjected = new Array(this.metricValues['metricId'].length)
        this.pointsEarnedProjectedCalculated = new Array(this.metricValues['metricId'].length)
        this.possiblePointsProjected = new Array(this.metricValues['metricId'].length)
        let score, numerator, denominator
        this.metricValues['score'].forEach((v, metricIndex) => {
          this.updateProjectedValuesAtIndex(metricIndex, v.number, true)
        })
        
        // for each of the domain calculate rollup values based upon projected values
        this.updateProjectedRollUpValues('Achievement', true)
        this.updateProjectedRollUpValues('Progress', true)
        this.updateProjectedRollUpValues('Climate', true)
        this.updateProjectedRollUpValues('College & Career', true)
        this.updateProjectedRollUpValues('Overall', true)
        // console.log("metricValues scoreProjected", this.metricValues['scoreProjected'])
        
      }        
    },

    resetProjectedMetric (metricId) {
      // tell the slider to reset
      this.$refs['slider-projected-'+metricId][0].reset()
      const metricIndex = this.$qlik.lookupIndexByFieldValue(this.metricValues, "metricId", metricId, false)
      const scoreProjected = this.metricValues['score'][metricIndex].number
      this.updateProjectedValuesAtIndex(metricIndex, scoreProjected, true)
      this.updateProjectedRollUpValues(this.currentDomain)
      this.updateProjectedRollUpValues("Overall")
      this.$forceUpdate()
    },

    async updateCurrentDomain (domain) {
      this.currentDomain = domain
      this.metricIds = await this.$qlik.lookupValueByMultipleFieldValues(this.metricValues, {'domain_name': this.currentDomain, 'is_metric': true}, 'metricId', true, 'text')
    },

    async updateProjectedValuesByMetric (metricId, scoreProjected, doRollup) {
      const metricIndex = this.$qlik.lookupIndexByFieldValue(this.metricValues, "metricId", metricId, false)
      // console.log("update metric", metricId, "index:", metricIndex, "to", scoreProjected)
      this.updateProjectedValuesAtIndex(metricIndex, scoreProjected)
      const component = this.$refs["kpi-projected-" + metricId][0]
      if (doRollup) {
        // the domain must come before overall because 
        // overall pulls the calculated score of each of the domains, not all the individual metrics
        this.updateProjectedRollUpValues(this.currentDomain)
        this.updateProjectedRollUpValues("Overall")
        this.$forceUpdate()
      }
      
    },

    updateProjectedValuesAtIndex(metricIndex, scoreProjected, useDefaultValues) {
      let points, perc, pointsEarnedCalculated
      const metricId = this.metricValues['metricId'][metricIndex].text
      let isAgi = this.metricValues['isAgi'][metricIndex].number == 1
      let possiblePoints = this.metricValues['possiblePoints'][metricIndex].number
      let floor = this.metricValues['floorPoints'][metricIndex].number / (isAgi ? 1 : 100)
      let target = this.metricValues['targetPoints'][metricIndex].number / (isAgi ? 1 : 100)          
      let isSelected = this.metricValues['score'][metricIndex].isSelected
      let isExcluded = this.metricValues['score'][metricIndex].isExcluded

      if (useDefaultValues) {
        perc = this.metricValues['percEarned'][metricIndex].number
        points = this.metricValues['pointsEarned'][metricIndex].number
        // if there is a numerator and denominator, use that to create a score
        let numerator = this.metricValues['numerator'][metricIndex].number
        let denominator = this.metricValues['denominator'][metricIndex].number
        if (isFinite(parseFloat(numerator)) && isFinite(parseFloat(denominator))) {
          let scoreCalculated = numerator / denominator
          let percEarnedCalculated = Math.min(Math.max((scoreCalculated - floor) / (target - floor), 0), 1)
          pointsEarnedCalculated = Math.round(1000 * percEarnedCalculated * possiblePoints) / 1000
        } else {
          pointsEarnedCalculated = points
        }
          
      } else {
        perc = Math.min(Math.max((scoreProjected - floor) / (target - floor), 0), 1)
        points = perc * possiblePoints
        pointsEarnedCalculated = points
      }
      
      // use $set to let Vue know that we've updated a value
      this.$set(this.scoreProjected, metricId, scoreProjected)
      this.$set(this.percEarnedProjected, metricId, perc)
      this.$set(this.pointsEarnedProjected, metricId, points)
      this.$set(this.pointsEarnedProjectedCalculated, metricId, pointsEarnedCalculated)
      this.$set(this.possiblePointsProjected, metricId, possiblePoints)
    },

    updateProjectedRollUpValues(domain, useDefaultValues) {
      const mapDomainToId = domain => {
        if (domain == 'Overall') {
          return 'Z_OVERALL_OVERALL'
        } else if (domain == 'Achievement') {
          return 'Z_ACH_OVERALL'
        } else if (domain == 'Progress') {
          return 'Z_PROG_OVERALL'
        } else if (domain == 'Climate') {
          return 'Z_CLIM_OVERALL'
        } else if (domain == 'College & Career') {
          return 'Z_CC_OVERALL'
        } 
      }
      const domainId = mapDomainToId(domain)
      const domainIndex = this.$qlik.lookupIndexByFieldValue(this.metricValues, "metricId", domainId, false)
      const isSelected = this.metricValues['possiblePoints'][domainIndex].isSelected
      const isExcluded = this.metricValues['possiblePoints'][domainIndex].isExcluded
      let perc, pointsEarned, possiblePoints      

      if (useDefaultValues) {
        possiblePoints = this.metricValues['possiblePoints'][domainIndex].number
        pointsEarned = this.metricValues['pointsEarned'][domainIndex].number
        perc = this.metricValues['percEarned'][domainIndex].number
      } else {
        let metricIds, pointsEarnedProjected, possiblePointsProjected
        if (domain == 'Overall') {
          metricIds = this.$qlik.lookupValueByFieldValue(this.metricValues, "is_domain", 1, 'metricId', true, 'text')
          pointsEarnedProjected = metricIds.map(id => this.pointsEarnedProjected[id])
          possiblePointsProjected = metricIds.map(id => this.possiblePointsProjected[id])
        } else {
          metricIds = this.$qlik.lookupValueByMultipleFieldValues(this.metricValues, {"is_metric": 1, "domain_name": domain }, 'metricId', true, 'text')
          pointsEarnedProjected = metricIds.map(id => this.pointsEarnedProjectedCalculated[id])
          possiblePointsProjected = metricIds.map(id => this.possiblePointsProjected[id]) 
        }

        pointsEarned = Math.round(100 * pointsEarnedProjected.reduce((acc, val) => acc + (isFinite(parseFloat(val)) ? parseFloat(val): 0), 0)) / 100
        possiblePoints = Math.round(100 * possiblePointsProjected.reduce((acc, val) => acc + (isFinite(parseFloat(val)) ? parseFloat(val): 0), 0)) / 100
        perc = pointsEarned / possiblePoints
        perc = Math.round(100 * perc) / 100
      }
      // console.log("points", domain, domainIndex, pointsEarned, possiblePoints, perc) //projected_points, 
      
      // use $set to let Vue know that we've updated a value
      this.$set(this.percEarnedProjected, domainId, perc)
      this.$set(this.pointsEarnedProjected, domainId, pointsEarned)
      this.$set(this.possiblePointsProjected, domainId, possiblePoints)
    }, 
    
    //import formatValue as method and filter
    formatValue
  },
  created() {      
    if (this.schoolsInitialized) this.initialize()
  },
  beforeDestroy() {    
    this.destroy()
  },
  filters: {
    formatValue
  }
}
</script>
<style lang="postcss" scoped>

h1 {
  font-size: 20pt;
  font-weight: bold;
}

h2 {
  font-size: 18pt;
  font-weight: bold;
}

h3 {
  font-size: 14pt;
  font-weight: bold;
}

h4 {
  font-size: 14pt;
  font-weight: 600;
}

h5 {
  font-size: 13pt;
  font-weight: 500;
}

h6 {
  font-size: 12pt;
  font-weight: 500;
}


hr {
  margin-top: 5px;
  margin-bottom: 1rem;
  border-top: 2px solid #888888;
}

hr.page {
  border-top: 80px solid #666666;
}

hr.dark {
  border-top: 2px solid #666666;
}

hr.medium {
  border-top: 2px solid #888888;
}

hr.light {
  border-top: 1px solid #aaaaaa;
}

hr.tint {
  border-top: 1px solid #cccccc;
}

.domain-nav-item {
  @apply text-lg my-2 cursor-pointer outline-none;
}

.domain-nav-item:hover {
  @apply font-semibold;
}

.domain-nav-item.active {
  @apply font-semibold border-b-2 border-gray-600;
}

.spr-intervene {
  color: theme('colors.spr-intervene');
}

.spr-watch {
  color: theme('colors.spr-watch');
}

.spr-reinforce {
  color: theme('colors.spr-reinforce');
}

.spr-model {
  color: theme('colors.spr-model');
}

.bg-spr-intervene {
  background-color: theme('colors.spr-intervene');
}

.bg-spr-watch {
  background-color: theme('colors.spr-watch');
}

.bg-spr-reinforce {
  background-color: theme('colors.spr-reinforce');
}

.bg-spr-model {
  background-color: theme('colors.spr-model');
}
</style>