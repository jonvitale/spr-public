<template>
  <div>
    <Columns>
      <Column side="left" width="1/3">    
        <div class="text-left sticky top-0">
          <div class="flex flex-col align-middle lg:py-4">
            <Square color="tint" tight class="py-6 mb-6">
              <h5 class="w-full text-center"> 
                Performance Tiers Color Key 
              </h5>
              <div class="flex flex-row flex-wrap justify-between">                
                <div class="spr-model text-center">
                  <h6> Model </h6>
                  <p> 100%-75% </p>
                </div>
                <div class="spr-reinforce text-center px-2">
                  <h6> Reinforce </h6>
                  <p> 74%-50% </p>
                </div>
                <div class="spr-watch text-center px-2">
                  <h6> Watch </h6>
                  <p> 49%-25% </p>
                </div>
                <div class="spr-intervene text-center px-2">
                  <h6> Intervene </h6>
                  <p> 24%-0% </p>
                </div>
              </div>
            </Square>
            <Square color="tint">
              <h3 class="w-full text-center"> Scores </h3>
              <div v-for="domain in domainFacts" :key="domain.key"> 
                <div v-if="domain.key !== 'ee' && (domain.key !== 'cc' || report_name === 'High School')">
                  <div class="flex flex-row justify-between">
                    <h4> {{ domain.title }} </h4>
                    <button> Reset </button>
                  </div>
                  <div class="flex flex-row justify-between">
                    <div class="text-white py-1 px-4 mr-2"
                      :style="{'background-color': getSPRColorByTextValue(lookupTextByFieldValue('metric_id', domain.metric_id, 'perc-earned'))}"
                    > 
                      <h4> Current </h4>
                      <h1 class="text-right"> 
                        {{lookupTextByFieldValue('metric_id', domain.metric_id, 'perc-earned')}} 
                      </h1>                      
                      <p> 
                        <span class="text-lg">{{ lookupTextByFieldValue('metric_id', domain.metric_id, 'points-earned') }} </span>
                        <span class="text-md">out of </span>
                        <span class="text-lg">{{ lookupTextByFieldValue('metric_id', domain.metric_id, 'points-possible') }} </span>
                      </p>
                    </div>
                    <div class="text-white py-1 px-4 mr-2"
                      :style="{'background-color': getSPRColorByTextValue(lookupProjectedTextByFieldValue('metric_id', domain.metric_id, 'perc-earned'))}"
                    > 
                      <h4> Projected </h4>
                      <h1 class="text-right"> 
                        {{lookupProjectedTextByFieldValue('metric_id', domain.metric_id, 'perc-earned')}} 
                      </h1>
                      <p> 
                        <span class="text-lg">{{ lookupProjectedTextByFieldValue('metric_id', domain.metric_id, 'points-earned') }} </span>
                        <span class="text-md"> out of </span>
                        <span class="text-lg">{{ lookupProjectedTextByFieldValue('metric_id', domain.metric_id, 'points-possible') }} </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>              
            </Square>
          </div>
        </div>
      </Column>
      <Column side="right" width="2/3">
        <div class="sticky">
          <div class="flex flex-row justify-between">
            <button @click="currentDomain='Achievement'"> Achievement </button>
            <button @click="currentDomain='Progress'"> Progress </button>
            <button @click="currentDomain='Climate'"> Climate </button>
            <button @click="currentDomain='College & Career'"> College &amp; Career </button>
          </div>
          &nbsp;
          <div class="flex flex-row">
            <div class="w-full lg:w-1/2">
              <div> Scored Range and Metric Score </div>
            </div>
            <div class="flex flex-row w-full lg:w-1/2">
              <div class="w-1/4"> Current Points </div>
              <div class="w-1/4"> Projected Points </div>
              <div class="w-1/4"> Projected Change </div>
              <div class="w-1/4"> &nbsp; </div>
            </div>
          </div>
        </div>
        <div v-for="metric_id in metricIds" :key="metric_id">
          <div class="flex flex-row"
            v-if="isApplicableByMetricId(metric_id) && lookupNumberByFieldValue('metric_id', metric_id, 'points-possible') > 0"
            >
            <div class="w-full lg:w-1/2">
              <h5> 
                {{lookupTextByFieldValue('metric_id', metric_id, 'metric_name') }} 
              </h5>
              <ProjectionSlider
                class="w-full"
                :currentValue="lookupNumberByFieldValue('metric_id', metric_id, 'points-earned')"
                :min="0"
                :max="lookupNumberByFieldValue('metric_id', metric_id, 'points-possible')"
              />
            </div>
            <div class="flex flex-row w-full lg:w-1/2">
              <div class="flex flex-row justify-between">
                <div class="text-white py-1 px-4 mr-2"
                  :style="{'background-color': getSPRColorByTextValue(lookupTextByFieldValue('metric_id', metric_id, 'perc-earned'))}"
                  > 
                  <h4> Current </h4>
                  <h1 class="text-right"> 
                    {{lookupTextByFieldValue('metric_id', metric_id, 'perc-earned')}} 
                  </h1>
                  <p> 
                    <span class="text-lg">{{ lookupTextByFieldValue('metric_id', metric_id, 'points-earned') }} </span>
                    <span class="text-md">out of </span>
                    <span class="text-lg">{{ lookupTextByFieldValue('metric_id', metric_id, 'points-possible') }} </span>
                  </p>
                </div>
                <div class="text-white py-1 px-4 mr-2"
                  :style="{'background-color': getSPRColorByTextValue(lookupProjectedTextByFieldValue('metric_id', metric_id, 'perc-earned'))}"
                  > 
                  <h4> Projected </h4>
                  <h1 class="text-right"> 
                    {{lookupProjectedTextByFieldValue('metric_id', metric_id, 'perc-earned')}} 
                  </h1>
                  <p> 
                    <span class="text-lg">{{ lookupProjectedTextByFieldValue('metric_id', metric_id, 'points-earned') }} </span>
                    <span class="text-md"> out of </span>
                    <span class="text-lg">{{ lookupProjectedTextByFieldValue('metric_id', metric_id, 'points-possible') }} </span>
                  </p>
                </div>
                <div class="text-black py-1 px-4 mr-2">
                  <h1>
                    {{ 
                      (lookupProjectedNumberByFieldValue('metric_id', metric_id, 'perc-earned') - 
                      lookupNumberByFieldValue('metric_id', metric_id, 'perc-earned')) 
                    }} 
                  </h1>
                </div>
                <div>
                  <button> Reset </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Column>
    </Columns>
  </div>
</template>

<script>
import metricValuesDef from '~/definitions/reportMeasures'

import ProjectionSlider from '~components/PageElements/ProjectionSlider.vue'
import Columns from '~components/PageElements/Columns.vue'
import Column from '~components/PageElements/Column.vue'
import Square from '~components/PageElements/Square.vue'

const domainFacts = [
  {
    key: 'overall',
    title: 'Overall',
    metric_id: 'Z_OVERALL_OVERALL',
    description: 'A school’s overall score represents its combined performance on the Achievement, Progress, Climate, and College & Career (for high schools only) domains.',
  },
  {
    key: 'achievement',
    title: 'Achievement',
    metric_id: 'Z_ACH_OVERALL',
    description: 'The Achievement domain measures performance on standardized assessments, including PSSA, Keystone Exams, ACCESS for ELLs, and reading assessments.',
    metric_groups: [
      {          
        key: 'DRA',
        metrics: [
          { title: '% Reading at Grade Level- Grades K-2', metric_id: 'DRA' },
        ]
      },
      {
        key: 'PSSA_ELA',
        title: 'PSSA: English Language Arts',
        metrics: [
          { subtitle: '% Proficient or Advanced', metric_id: 'PSSA_PROFADV_ELA' },
          { subtitle: 'Grade 3 - % Proficient or Advanced', metric_id: 'PSSA_PROFADV_ELA_G3' },
          { subtitle: 'Grade 4 - % Proficient or Advanced', metric_id: 'PSSA_PROFADV_ELA_G4' },
          { subtitle: 'Grade 5 - % Proficient or Advanced', metric_id: 'PSSA_PROFADV_ELA_G5' },
          { subtitle: 'Grade 6 - % Proficient or Advanced', metric_id: 'PSSA_PROFADV_ELA_G6' },
          { subtitle: '% Advanced', metric_id: 'PSSA_ADV_ELA' },
        ]
      },
      {
        key: 'PSSA_MATH',
        title: 'PSSA: Mathematics',
        metrics: [
          { subtitle: '% Proficient or Advanced', metric_id: 'PSSA_PROFADV_MATH' },
          { subtitle: 'Grade 3 - % Proficient or Advanced', metric_id: 'PSSA_PROFADV_MATH_G3' },
          { subtitle: 'Grade 4 - % Proficient or Advanced', metric_id: 'PSSA_PROFADV_MATH_G4' },
          { subtitle: 'Grade 5 - % Proficient or Advanced', metric_id: 'PSSA_PROFADV_MATH_G5' },
          { subtitle: 'Grade 6 - % Proficient or Advanced', metric_id: 'PSSA_PROFADV_MATH_G6' },
          { subtitle: '% Advanced', metric_id: 'PSSA_ADV_MATH' },
        ]
      },
      {
        key: 'PSSA_SCI',
        title: 'PSSA: Science',
        metrics: [
          { subtitle: '% Proficient or Advanced', metric_id: 'PSSA_PROFADV_SCI' },
          { subtitle: 'Grade 4 - % Proficient or Advanced', metric_id: 'PSSA_PROFADV_SCI_G4' },
          { subtitle: '% Advanced', metric_id: 'PSSA_ADV_SCI' },
        ]
      },
      {
        key: 'KEYSTONE_ALG1',
        title: 'Keystone Exam - Algebra I',
        metrics: [
          { subtitle: '% Proficient or Advanced', metric_id: 'KEYSTONE_PROFADV_ALG1' },
          { subtitle: 'Grade 9 - % Proficient or Advanced', metric_id: 'KEYSTONE_PROFADV_ALG1_G9' },
          { subtitle: '% Advanced', metric_id: 'KEYSTONE_ADV_ALG1' },
        ]
      },
      {
        key: 'KEYSTONE_BIO',
        title: 'Keystone Exam - Biology',
        metrics: [
          { subtitle: '% Proficient or Advanced', metric_id: 'KEYSTONE_PROFADV_BIO' },
          { subtitle: '% Advanced', metric_id: 'KEYSTONE_ADV_BIO' },
        ]
      },
      {
        key: 'KEYSTONE_LIT',
        title: 'Keystone Exam - Literature',
        metrics: [
          { subtitle: '% Proficient or Advanced', metric_id: 'KEYSTONE_PROFADV_LIT' },
          { subtitle: '% Advanced', metric_id: 'KEYSTONE_ADV_LIT' },
        ]
      },
      {          
        key: 'ACCESS_PROF',
        metrics: [
          { title: 'ACCESS for ELLs:', subtitle: '% 4.5 or Above', metric_id: 'ACCESS_PROF' },
        ]
      },
      
    ]
  },
  {
    key: 'progress',
    title: 'Progress',
    metric_id: 'Z_PROG_OVERALL',
    description: 'The Progress domain measures growth on standardized assessments and progress towards graduation (for high schools only).',
    metric_groups: [
      {
        key: 'PSSA_MATH_AGI',
        metrics: [
          {  title: 'PSSA Mathematics:', subtitle: 'Average Growth Index (AGI)', metric_id: 'PSSA_MATH_AGI' },
        ]
      },
      {
        key: 'PSSA_ELA_AGI',
        metrics: [
          {  title: 'PSSA English Language Arts:', subtitle: 'Average Growth Index (AGI)', metric_id: 'PSSA_ELA_AGI' },
        ]
      },
      {
        key: 'PSSA_GR_4_SCIENCE_AGI',
        metrics: [
          {  title: 'PSSA Science (Grade 4):', subtitle: 'Average Growth Index (AGI)', metric_id: 'PSSA_GR_4_SCIENCE_AGI' },
        ]
      },
      {
        key: 'KEYSTONE_ALG1_AGI',
        metrics: [
          {  title: 'Keystone Exam - Algebra I:', subtitle: 'Average Growth Index (AGI)', metric_id: 'KEYSTONE_ALGEBRA_I_AGI' },
        ]
      },
      {
        key: 'KEYSTONE_BIO_AGI',          
        metrics: [
          { title: 'Keystone Exam - Biology:', subtitle: 'Average Growth Index (AGI)', metric_id: 'KEYSTONE_BIOLOGY_AGI' },
        ]
      },
      {
        key: 'KEYSTONE_LIT_AGI',
        metrics: [
          { title: 'Keystone Exam - Literature:', subtitle: 'Average Growth Index (AGI)', metric_id: 'KEYSTONE_LITERATURE_AGI' },
        ]
      },
      {
        key: 'STAY_ON_TRACK',
        metrics: [
          { title: '% of On-Track Students', subtitle: 'Earning Credits Required for Promotion', metric_id: 'STAY_ON_TRACK' },
        ]
      },
      {
        key: 'BACK_ON_TRACK',
        metrics: [
          { title: '% of Off-Track Students', subtitle: 'Earning Credits Required for Promotion', metric_id: 'BACK_ON_TRACK' },
        ]
      },
      {
        key: 'ACCESS_GROWTH', 
        metrics: [
          { title: 'ACCESS for ELLs', subtitle: '% Growth in 60th Percentile or Above', metric_id: 'ACCESS_GROWTH' },
        ]
      },
      { 
        key: 'EQUITY_HEADER',
        title: 'Progress, On Equity',
        header: true,
      },
      {
        key: 'PSSA_MATH_AGI_L33P',
        metrics: [
          {  title: 'PSSA Mathematics: ', subtitle: 'AGI for Lowest-Performing 33% of Students', metric_id: 'PSSA_MATH_AGI_L33P' },
        ]
      },
      {
        key: 'PSSA_ELA_AGI_L33P',
        metrics: [
          {  title: 'PSSA English Language Arts: ', subtitle: 'AGI for Lowest-Performing 33% of Students', metric_id: 'PSSA_ELA_AGI_L33P' },
        ]
      },
      {
        key: 'KEYSTONE_ALG1_AGI_L33P',
        metrics: [
          {  title: 'Keystone Exam - Algebra I: ', subtitle: 'AGI for Lowest-Performing 33% of Students', metric_id: 'KEYSTONE_ALG1_AGI_L33P' },
        ]
      },
      {
        key: 'KEYSTONE_BIO_AGI_L33P',
        metrics: [
          { title: 'Keystone Exam - Biology: ', subtitle: 'AGI for Lowest-Performing 33% of Students', metric_id: 'KEYSTONE_BIO_AGI_L33P' },
        ]
      },
      {
        key: 'KEYSTONE_LIT_AGI_L33P',
        metrics: [
          { title: 'Keystone Exam - Literature: ', subtitle: 'AGI for Lowest-Performing 33% of Students', metric_id: 'KEYSTONE_LIT_AGI_L33P' },
        ]
      },
    ],
  },
  {
    key: 'climate',
    title: 'Climate',
    metric_id: 'Z_CLIM_OVERALL',
    description: 'The Climate domain measures school climate and student and parent/guardian engagement.',
    metric_groups: [
      {
        key: 'ATTENDANCE',
        metrics: [
          { title: '% of Students Attending 95% or More of Instructional Days', metric_id: 'ATTENDANCE_95MORE' },
          { subtitle: '% Attending 90% to 95% of days', metric_id: 'ATTENDANCE_9095' },
          { subtitle: '% Attending 85% to 90% of days', metric_id: 'ATTENDANCE_8590' },
          { subtitle: '% Attending 80% to 85% of days', metric_id: 'ATTENDANCE_8085' },
          { subtitle: '% Attending less than 80% of days', metric_id: 'ATTENDANCE_LT80' },            
        ]
      },
      {
        key: 'RETENTION',
        metrics: [
          { title: 'Annual Retention Rate', metric_id: 'RETENTION' },
        ]
      },
      {
        key: 'ISS',
        metrics: [
          { title: '% of Students with Zero In-School Suspensions', metric_id: 'ISS' },
        ]
      },
      {
        key: 'OSS',
        metrics: [
          { title: '% of Students with Zero Out-of-School Suspensions', metric_id: 'OSS' },
        ]
      },
      {
        key: 'SVY_CLIM_STUD',
        metrics: [
          { title: 'Student Survey: School Climate Rating (% most positive responses)', metric_id: 'SVY_CLIM_STUD' },
        ]
      },
      {
        key: 'SVY_CLIM_PAR',
        metrics: [
          { title: 'Parent Survey: School Climate Rating (% most positive responses)', metric_id: 'SVY_CLIM_PAR' },
        ]
      },
      {
        key: 'SVY_PARENT_RATE',
        metrics: [
          { title: 'Parent/Guardian Survey: Participation Rate', metric_id: 'SVY_PARENT_RATE' },
        ]
      },
    ],
  },
  {
    key: 'cc',
    title: 'College & Career',
    title_style: {fontSize: '16pt', fontWeight: 700},
    metric_id: 'Z_CC_OVERALL',
    description: 'The College & Career domain measures college and career readiness and post-secondary outcomes.',
    metric_groups: [
      {
        key: 'GRAD',
        metrics: [
          { title: 'Four-Year Cohort Graduation Rate', metric_id: 'GRAD' },
        ]
      },
      {
        key: 'FF_MATRIC',
        metrics: [
          { title: 'First-Fall College Matriculation Rate', metric_id: 'FF_MATRIC' },
        ]
      },
      {
        key: 'AP_IB_NOCTI',
        metrics: [
          { title: 'SAT & ACT Exams Participation & Performance', metric_id: 'AP_IB_NOCTI' },
          { subtitle: '% Participating Not Meeting Threshold', metric_id: 'AP_IB_NOCTI_NOTPASS' },
          { subtitle: '% Not Participating', metric_id: 'AP_IB_NOCTI_NOTPARTICIPATE' },      
        ]
      },
      {
        key: 'ACT_SAT',
        metrics: [
          { title: 'SAT & ACT Exams Participation & Performance', metric_id: 'ACT_SAT' },
          { subtitle: '% Participating Not Meeting Threshold', metric_id: 'ACT_SAT_NOTPASS' },
          { subtitle: '% Not Participating', metric_id: 'ACT_SAT_NOTPARTICIPATE' },      
        ]
      },
        {
        key: 'FAFSA',
        metrics: [
          { title: 'FAFSA Completion Rate', metric_id: 'FAFSA' },
        ]
      },
      {
        key: 'SVY_STUD_CCR',
        metrics: [
          { title: 'Student Survey:', subtitle: 'College & Career Readiness Rating (% most positive responses)', metric_id: 'SVY_STUD_CCR' },
        ]
      },
    ]
  },
  {
    key: 'ee',
    title: 'Educator Effectiveness',
    metric_groups: [
      {
        key: 'MMS_DISTIN',
        metrics: [
          { title: '% of Teachers Receiving an MMS Rating of Distinguished', metric_id: 'MMS_DISTIN' },
        ]
      },
      {
        key: 'MMS_PROF',
        metrics: [
          { title: '% of Teachers Receiving an MMS Rating of Proficient', metric_id: 'MMS_PROF' },
        ]
      },
      {
        key: 'MMS_NEEDS_IMP',
        metrics: [
          { title: '% of Teachers Receiving an MMS Rating of Needs Improvement', metric_id: 'MMS_NEEDS_IMP' },
        ]
      },
      {
        key: 'MMS_FAILING',
        metrics: [
          { title: '% of Teachers Receiving an MMS Rating of Failing', metric_id: 'MMS_FAILING' },
        ]
      },
      {
        key: 'ESSA_EFF',
        metrics: [
          { title: '% of Teachers Receiving an ESSA Rating of Effective', metric_id: 'ESSA_EFF' },
        ]
      },
      {
        key: 'ESSA_INEFF',
        metrics: [
          { title: '% of Teachers Receiving an ESSA Rating of Ineffective', metric_id: 'ESSA_INEFF' },
        ]
      },
      {
        key: 'TEACH_ATTENDANCE',
        metrics: [
          { title: '% of Teachers Attending 95% or More of Days', metric_id: 'TEACH_ATTENDANCE' },
        ]
      },
      {
        key: 'SVY_STUD_TEACH',
        metrics: [
          { title: 'Student Survey: Student Perception of Quality of Teacher Practice', subtitle: '(% of most positive responses)', metric_id: 'SVY_STUD_TEACH' },
        ]
      },
    ]
  }
]

export default {
  components: {
    Columns,
    Column,
    Square,
    ProjectionSlider,
  },
  data() {
    return {
      currentDomain: "Achievement",
      domainFacts: domainFacts,
      sessionObject: null,
      schoolsInitialized: this.$store.state.schools.initialized,
      slug_report: this.$route.params.slug_report,
      metricValues: null,
    }
  },
  computed: {
    metricIds() {
      let metricIds = this.lookupTextByFieldValue('domain_name', this.currentDomain, 'metric_id', true)
      if (Array.isArray(metricIds)) {
        metricIds = metricIds.filter(m => !m.includes("OVERALL"))      
      }
      return metricIds
    },
    school_report: state => state.$store.getters['schools/lookupTextBySlugReport'](state.slug_report, "school_report"),
    srcschoolid: state => state.$store.getters['schools/lookupTextBySlugReport'](state.slug_report, "srcschoolid"),
    schoolname: state => state.$store.getters['schools/lookupTextBySlugReport'](state.slug_report, "schoolname"),
    report_name: state => state.$store.getters['schools/lookupTextBySlugReport'](state.slug_report, "report_name"),
    
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

    getSPRColorByTextValue (textVal) {
      const val = parseInt(textVal)
      // console.log("this val for color", val)
      if (val < 25) { return '#c0504d' }
      else if (val < 50) { return "#f79646" }
      else if (val < 75) { return "#00b050" }
      else if (val >= 75) { return "#0070c0" }
      else { return "#888888" }
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

    lookupProjectedTextByFieldValue (sourceField, sourceFieldValue, targetField, returnMultiple) {
      return this.lookupTextByFieldValue(sourceField, sourceFieldValue, targetField, returnMultiple)
    },

    lookupProjectedNumberByFieldValue (sourceField, sourceFieldValue, targetField, returnMultiple) {
      return this.lookupNumberByFieldValue(sourceField, sourceFieldValue, targetField, returnMultiple)
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
      let selectedValues = {}
      selectedValues["school_report"] = await this.$qlik.selectFieldValues("School Name (Reporting Category)", [{text: this.school_report}])
      this.$store.dispatch("update_current_selections", selectedValues)
      // this.getCurrentScrollSection()
      this.update()
    },

    isApplicableByMetricId (metric_id) {
      if (this.metricValues) {
        const values = this.$qlik.lookupValueByFieldValue(this.metricValues, "metric_id", metric_id, "exception")
        if (values && values.number) {
          return values.number !== 999
        } else {
          return true
        }
      } else {
        return null
      }
    },

    async update() {
      if (this.sessionObject) {
        this.metricValues = await this.$qlik.getValuesFromHypercubeObject(this.sessionObject)
      }        
    },
  },
  created() {      
    if (this.schoolsInitialized) this.initialize()
  },
  beforeDestroy() {    
    this.destroy()
  },
}
</script>
<style scoped>
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

.box {
  float: left;
  margin-top: 3pt;
  background-color: black;
  width: 10pt;
  height: 10pt;
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