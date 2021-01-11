<template>
  <div>
    <Columns id="columnstop">
      <!-- left side: overall and domain scores -->
      <Column side="left" width="1/3">
        <div class="text-left sticky top-0">
          <div class="flex flex-col align-middle">
            <Square color="tint" tight class="py-6 mb-6">
              <h1 id="spr-title" class="uppercase">SPR Calculator</h1>
              <div class="text-left mb-1 p-2">
                <p>
                  The SPR Calculator is a tool designed to help you better
                  understand a school’s SPR score and how that score might
                  change as the school’s performance changes.
                </p>
              </div>
              <button
                class="blink text-blue-800 bg-white px-2 py-1 text-base font-bold uppercase hover:bg-gray-200 focus:outline-none"
                @click="launchTour"
              >
                Give me a tour
              </button>
              <h5 class="w-full text-center">
                Performance Tiers Color Key
              </h5>
              <div class="flex flex-row flex-wrap justify-between">
                <div class="spr-intervene text-center px-2">
                  <h6>Intervene</h6>
                  <p>0-24%</p>
                </div>
                <div class="spr-watch text-center px-2">
                  <h6>Watch</h6>
                  <p>25-49%</p>
                </div>
                <div class="spr-reinforce text-center px-2">
                  <h6>Reinforce</h6>
                  <p>50-74%</p>
                </div>
                <div class="spr-model text-center">
                  <h6>Model</h6>
                  <p>75-100%</p>
                </div>
              </div>
            </Square>
            <Square color="tint">
              <h3 class="w-full text-center">Scores</h3>
              <div v-for="domain in domainFacts" :key="domain.key">
                <div
                  v-if="
                    domain.key !== 'ee' &&
                      (domain.key !== 'cc' || reportName === 'High School')
                  "
                >
                  <div class="flex flex-row mx-2">
                    <h4 class="w-1/2 text-center">{{ domain.title }}</h4>
                    <button
                      class="w-1/2 font-bold text-blue-500 text-base focus:outline-none hover:bg-gray-300"
                      @click="resetProjectedDomain(domain.title)"
                    >
                      Reset
                    </button>
                  </div>
                  <div class="flex flex-row justify-center">
                    <KPI
                      :ref="'kpi-agg-current-' + domain.key"
                      class="mr-2"
                      style="width: 11rem; height: 7rem;"
                      align="right"
                      tight
                      :color="
                        getCalculatedPointsPossible(domain.metricId) >=
                        getMinNeededPointsPossible(domain.metricId)
                          ? getSPRTierByValue(
                              $qlik.lookupValueByFieldValue(
                                metricValues,
                                'metricId',
                                domain.metricId,
                                'percEarned',
                                false,
                                'text'
                              )
                            )
                          : 'gray'
                      "
                      title="Current"
                      :primary="
                        getCalculatedPointsPossible(domain.metricId) >=
                        getMinNeededPointsPossible(domain.metricId)
                          ? formatValue(
                              $qlik.lookupValueByFieldValue(
                                metricValues,
                                'metricId',
                                domain.metricId,
                                'percEarned',
                                false,
                                'number'
                              ),
                              true,
                              true
                            )
                          : '-'
                      "
                      :description="
                        formatValue(
                          getCalculatedPointsPossible(domain.metricId) >=
                            getMinNeededPointsPossible(domain.metricId)
                            ? $qlik.lookupValueByFieldValue(
                                metricValues,
                                'metricId',
                                domain.metricId,
                                'pointsEarned',
                                false,
                                'number'
                              )
                            : getCalculatedPointsEarned(domain.metricId),
                          false
                        ) +
                          ' out of ' +
                          formatValue(
                            getCalculatedPointsPossible(domain.metricId) >=
                              getMinNeededPointsPossible(domain.metricId)
                              ? $qlik.lookupValueByFieldValue(
                                  metricValues,
                                  'metricId',
                                  domain.metricId,
                                  'possiblePoints',
                                  false,
                                  'number'
                                )
                              : getCalculatedPointsPossible(domain.metricId),
                            false
                          )
                      "
                    />
                    <KPI
                      :id="'kpi-agg-projected-' + domain.key"
                      :ref="'kpi-agg-projected-' + domain.key"
                      class="mr-2"
                      style="width: 11rem; height: 7rem;"
                      align="right"
                      tight
                      :color="
                        getProjectedValue(
                          domain.metricId,
                          'possiblePointsProjected'
                        ) >= getMinNeededPointsPossible(domain.metricId)
                          ? getSPRTierByValue(
                              getProjectedValue(
                                domain.metricId,
                                'percEarnedProjected'
                              )
                            )
                          : 'gray'
                      "
                      title="Projected"
                      :primary="
                        getProjectedValue(
                          domain.metricId,
                          'possiblePointsProjected'
                        ) >= getMinNeededPointsPossible(domain.metricId)
                          ? formatValue(
                              getProjectedValue(
                                domain.metricId,
                                'percEarnedProjected'
                              ),
                              true,
                              true
                            )
                          : '-'
                      "
                      :description="
                        formatValue(
                          getProjectedValue(
                            domain.metricId,
                            'pointsEarnedProjected'
                          ),
                          false
                        ) +
                          ' out of ' +
                          formatValue(
                            getProjectedValue(
                              domain.metricId,
                              'possiblePointsProjected'
                            ),
                            false
                          )
                      "
                    />
                  </div>
                </div>
              </div>
            </Square>
            <div class="p-2 text-sm">
              If a % earned value is blank then the school is not eligible for
              enough points possible for the score to appear in this year's
              printed report.
            </div>
          </div>
        </div>
      </Column>

      <!-- right side: individual metric scores and projection sliders -->
      <Column side="right" width="2/3">
        <div class="flex items-end">
          <div id="school-name" class="h1 mr-5">{{ schoolName }}</div>
          <nuxt-link
            id="school-name-change"
            :to="'/calculator'"
            class="inline text-lg bg-white text-blue-500 font-semibold border-none py-2 pl-2 focus:outline-none hover:bg-gray-200"
          >
            <unicon
              fill="#4299e1"
              style="vertical-align:text-bottom"
              name="arrow-circle-left"
            />
            <span class="underline" style="vertical-align:text-bottom">
              Change School Report
            </span>
          </nuxt-link>
        </div>
        <!-- header above sliders -->
        <div class="sticky">
          <!-- domain buttons -->
          <div id="domain-nav" class="flex flex-row justify-between">
            <button
              id="achievement-nav"
              class="domain-nav-item focus:outline-none hover:bg-gray-200"
              :class="{ active: currentDomain == 'Achievement' }"
              @click="updateCurrentDomain('Achievement')"
            >
              Achievement
            </button>
            <button
              class="domain-nav-item"
              :class="{ active: currentDomain == 'Progress' }"
              @click="updateCurrentDomain('Progress')"
            >
              Progress
            </button>
            <button
              class="domain-nav-item"
              :class="{ active: currentDomain == 'Climate' }"
              @click="updateCurrentDomain('Climate')"
            >
              Climate
            </button>
            <button
              v-if="reportName === 'High School'"
              class="domain-nav-item"
              :class="{ active: currentDomain == 'College & Career' }"
              @click="updateCurrentDomain('College & Career')"
            >
              College &amp; Career
            </button>
          </div>
          &nbsp;
          <!-- column titles -->
          <div class="flex flex-row">
            <div class="w-full lg:w-1/2">
              <h6>Scored Range and Metric Score</h6>
            </div>
            <div class="flex w-full lg:w-1/2">
              <h6 class="w-2/5 mr-2 text-center">Current Points</h6>
              <h6 class="w-2/5 mr-2 text-center">Projected Points</h6>
              <h6 class="w-1/5 text-center">Projected Change</h6>
            </div>
          </div>
        </div>
        <!--  Projected Metric Sliders and KPIs-->
        <div v-for="(metricId, index) in applicableMetricIds" :key="metricId">
          <div
            v-if="getProjectedValue(metricId, 'isMetricUsed')"
            :id="'metric-' + index"
            class="flex flex-row flex-wrap mb-2 bg-gray-200"
          >
            <div class="w-full lg:w-1/2">
              <h6 class="p-1">
                {{
                  $qlik.lookupValueByFieldValue(
                    metricValues,
                    'metricId',
                    metricId,
                    'metricName',
                    false,
                    'text'
                  )
                }}
              </h6>
              <!--  -->
              <!-- Note: we only update the metric on input (every movement), but do all rollups on change -->
              <projection-slider
                :id="'slider-projected-' + index"
                :ref="'slider-projected-' + metricId"
                style="min-width:300px; max-width:600px; min-height:4rem;"
                class="w-full"
                :reference-value="
                  wasUsedByMetricId(metricId)
                    ? $qlik.lookupValueByFieldValue(
                        metricValues,
                        'metricId',
                        metricId,
                        'score',
                        false,
                        'number'
                      )
                    : NaN
                "
                :initial-projected-value="
                  getProjectedValue(metricId, 'scoreProjected')
                "
                :floor="
                  $qlik.lookupValueByFieldValue(
                    metricValues,
                    'metricId',
                    metricId,
                    'floorPointsMax',
                    false,
                    'number'
                  ) / 100
                "
                :ceiling="
                  $qlik.lookupValueByFieldValue(
                    metricValues,
                    'metricId',
                    metricId,
                    'targetPointsMax',
                    false,
                    'number'
                  ) / 100
                "
                :min="
                  $qlik.lookupValueByFieldValue(
                    metricValues,
                    'metricId',
                    metricId,
                    'isAgi',
                    false,
                    'number'
                  )
                    ? -10
                    : 0
                "
                :max="
                  $qlik.lookupValueByFieldValue(
                    metricValues,
                    'metricId',
                    metricId,
                    'isAgi',
                    false,
                    'number'
                  )
                    ? 10
                    : 1
                "
                :is-percent="
                  $qlik.lookupValueByFieldValue(
                    metricValues,
                    'metricId',
                    metricId,
                    'isAgi',
                    false,
                    'number'
                  ) != 1
                "
                @change="
                  updateProjectedValuesByMetricId(metricId, $event, true)
                "
                @input="updateProjectedValuesByMetricId(metricId, $event, true)"
              />

              <div class="flex justify-around">
                <button
                  class="font-bold text-blue-500 text-base focus:outline-none hover:bg-gray-300"
                  @click="resetProjectedMetric(metricId)"
                >
                  Reset
                </button>
                <button
                  :id="'remove-metric-' + index"
                  class="font-bold text-red-400 text-base focus:outline-none hover:bg-gray-300"
                  @click="updateIsMetricUsed(metricId, false)"
                >
                  Remove this Metric
                </button>
              </div>
            </div>
            <div class="flex flex-row items-center w-full lg:w-1/2">
              <KPI
                v-if="wasUsedByMetricId(metricId)"
                :ref="'kpi-current-' + metricId"
                class="w-2/5 mr-2"
                style="height: 7rem;"
                align="right"
                tight
                :color="
                  getSPRTierByValue(
                    $qlik.lookupValueByFieldValue(
                      metricValues,
                      'metricId',
                      metricId,
                      'percEarned',
                      false,
                      'text'
                    )
                  )
                "
                title="Current"
                :primary="
                  formatValue(
                    $qlik.lookupValueByFieldValue(
                      metricValues,
                      'metricId',
                      metricId,
                      'percEarned',
                      false,
                      'number'
                    ),
                    true,
                    true
                  )
                "
                :description="
                  formatValue(
                    $qlik.lookupValueByFieldValue(
                      metricValues,
                      'metricId',
                      metricId,
                      'pointsEarned',
                      false,
                      'number'
                    ),
                    false
                  ) +
                    ' out of ' +
                    formatValue(
                      $qlik.lookupValueByFieldValue(
                        metricValues,
                        'metricId',
                        metricId,
                        'possiblePoints',
                        false,
                        'number'
                      ),
                      false
                    )
                "
              />
              <div
                v-else
                class="text-center text-3xl text-red-600 bg-gray-200 w-2/5 mr-2"
              >
                N / A
              </div>
              <KPI
                :id="'kpi-projected-' + index"
                :ref="'kpi-projected-' + metricId"
                class="w-2/5 mr-2"
                style="height: 7rem;"
                align="right"
                tight
                :color="
                  getSPRTierByValue(
                    getProjectedValue(metricId, 'percEarnedProjected')
                  )
                "
                title="Projected"
                :primary="
                  formatValue(
                    getProjectedValue(metricId, 'percEarnedProjected'),
                    true,
                    true
                  )
                "
                :description="
                  formatValue(
                    getProjectedValue(metricId, 'pointsEarnedProjected'),
                    false
                  ) +
                    ' out of ' +
                    formatValue(
                      getProjectedValue(metricId, 'possiblePointsProjected'),
                      false
                    )
                "
              />
              <div
                class="w-1/5 flex justify-center items-center text-3xl bg-gray-400"
                :class="
                  getProjectedValue(metricId, 'percEarnedProjected') -
                    $qlik.lookupValueByFieldValue(
                      metricValues,
                      'metricId',
                      metricId,
                      'percEarned',
                      false,
                      'number'
                    ) >=
                  0
                    ? 'text-blue-600'
                    : 'text-red-600'
                "
                style="height: 7rem;"
              >
                <span v-if="wasUsedByMetricId(metricId)">
                  {{
                    (getProjectedValue(metricId, 'percEarnedProjected') -
                      $qlik.lookupValueByFieldValue(
                        metricValues,
                        'metricId',
                        metricId,
                        'percEarned',
                        false,
                        'number'
                      ))
                      | formatValue(true, true, true)
                  }}
                </span>
                <span v-else>
                  N / A
                </span>
              </div>
            </div>
          </div>
          <div
            v-else
            class="flex w-full justify-between items-center mb-2 bg-gray-400"
          >
            <div>
              <h6 class="p-1">
                {{
                  $qlik.lookupValueByFieldValue(
                    metricValues,
                    'metricId',
                    metricId,
                    'metricName',
                    false,
                    'text'
                  )
                }}
              </h6>
            </div>
            <div class="h-full">
              <h6 class="p-1 text-red-600">
                {{
                  $qlik.lookupValueByFieldValue(
                    metricValues,
                    'metricId',
                    metricId,
                    'exceptionName',
                    false,
                    'text'
                  )
                }}
              </h6>
            </div>
            <div class="h-full">
              <button
                class="text-base text-blue-500 font-bold p-1 focus:outline-none hover:bg-gray-300"
                @click="updateIsMetricUsed(metricId, true)"
              >
                Add this Metric
              </button>
            </div>
          </div>
        </div>
      </Column>
    </Columns>
    <v-tour
      class="text-lg"
      name="calculatorTour"
      :steps="tourSteps"
      :callbacks="tourCallbacks"
    />
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
    prepend = '+'
  }

  if (isPercent) {
    if (roundAtWhole) {
      return prepend + '' + Math.round(value * 100) + '%'
    } else {
      return prepend + '' + Math.round(value * 10000) / 100 + '%'
    }
  } else if (roundAtWhole) {
    return prepend + '' + Math.round(value)
  } else {
    return prepend + '' + Math.round(value * 100) / 100
  }
}

const domainFacts = [
  {
    key: 'overall',
    title: 'Overall',
    metricId: 'Z_OVERALL_OVERALL',
    description:
      'A school’s overall score represents its combined performance on the Achievement, Progress, Climate, and College & Career (for high schools only) domains.'
  },
  {
    key: 'achievement',
    title: 'Achievement',
    metricId: 'Z_ACH_OVERALL',
    description:
      'The Achievement domain measures performance on standardized assessments, including PSSA, Keystone Exams, ACCESS for ELLs, and reading assessments.'
  },
  {
    key: 'progress',
    title: 'Progress',
    metricId: 'Z_PROG_OVERALL',
    description:
      'The Progress domain measures growth on standardized assessments and progress towards graduation (for high schools only).'
  },
  {
    key: 'climate',
    title: 'Climate',
    metricId: 'Z_CLIM_OVERALL',
    description:
      'The Climate domain measures school climate and student and parent/guardian engagement.'
  },
  {
    key: 'cc',
    title: 'College & Career',
    title_style: { fontSize: '16pt', fontWeight: 700 },
    metricId: 'Z_CC_OVERALL',
    description:
      'The College & Career domain measures college and career readiness and post-secondary outcomes.'
  },
  {
    key: 'ee',
    title: 'Educator Effectiveness'
  }
]

export default {
  components: {
    Columns,
    Column,
    Square,
    KPI,
    ProjectionSlider
  },
  filters: {
    formatValue
  },
  data() {
    return {
      currentDomain: 'Achievement',
      domainFacts,
      showInstructions: false,
      sessionObject: null,
      schoolsInitialized: this.$store.state.schools.initialized,
      slugReport: this.$route.params.slug_report,
      metricIds: null,
      metricValues: null,
      // general facts about the school
      srcschoolid: '',
      schoolName: '',
      reportName: '',
      // keep projection values directly in key-value objects
      // this will make it easier to update the view
      scoreProjected: {},
      percEarnedProjected: {},
      pointsEarnedProjected: {},
      pointsEarnedProjectedCalculated: {},
      possiblePointsProjected: {},
      maxPossiblePointsProjected: {},
      isMetricUsed: {}, // default to whether the metric was used in the report, but user can change

      tourSteps: [
        {
          target: '#spr-title',
          content: 'Would you like to learn how to use the SPR Calculator?',
          params: { enableScrolling: false }
        },
        {
          target: '#achievement-nav',
          content:
            'The SPR is divided into sections, known as "Domains". You can select a different domain to change the displayed metrics.',
          params: { enableScrolling: true },
          offset: -400
        },
        {
          target: '#slider-projected-0',
          content:
            'For each metric, an interactive number line is displayed. You can move the dot left and right to change the score on this metric.',
          params: { enableScrolling: false }
        },
        {
          target: '#slider-projected-0',
          content:
            'As you move the dot, a number above the dot updates with <strong>your</strong> projected score. Another dot, with a score underneath, will remain at the original position.',
          params: { enableScrolling: false }
        },
        {
          target: '#kpi-projected-0',
          content:
            'After you change the score, the number and percent projected points will also change.',
          params: { enableScrolling: false }
        },
        {
          target: '#kpi-agg-projected-overall',
          content:
            'Additionally, the domain and overall scores will also update.',
          params: { enableScrolling: true },
          offset: -400
        },
        {
          target: '#slider-projected-0',
          content:
            'For some metrics a red area on the number line means no points earned. Likewise, a blue area means all points earned.',
          params: { enableScrolling: true },
          offset: -400
        },
        {
          target: '#remove-metric-0',
          content:
            'You can also remove a metric from the domain and overall calculation. Likewise, you can turn on metrics that were not included in the original report.',
          params: { enableScrolling: true },
          offset: -400
        },
        {
          target: '#school-name-change',
          content:
            'Click "Change School Report" to select a different school or report type.',
          params: { enableScrolling: true },
          offset: -400
        }
      ],

      tourCallbacks: {
        onSkip: () => this.$store.dispatch('tour/initialize_calculator'),
        onFinish: () => this.$store.dispatch('tour/initialize_calculator')
      }
    }
  },
  computed: {
    applicableMetricIds() {
      if (this.metricIds) {
        return this.metricIds.filter(metricId =>
          this.isApplicableByMetricId(metricId)
        )
      } else {
        return null
      }
    }
  },
  watch: {
    schoolsInitialized(to, from) {
      if (to && !from) {
        this.initialize()
      }
    }
  },
  created() {
    if (this.schoolsInitialized) this.initialize()
  },
  mounted() {
    if (!this.$store.state.tour.calculator_initialized) this.launchTour()
  },
  beforeDestroy() {
    this.destroy()
  },

  methods: {
    /**
     * initialize grabs the school's slug from the route param to use as this pages school.
     * We then get the full name of the school - and report type - from the slug.
     * Then select the school in the field to update the line graphs
     * Then get the measures from the metricValues hypermetricValues def
     * initialized depends upon the school list being loaded, so we must only call that when schools/initialized is true in vuex
     */
    async initialize() {
      this.sessionObject = await this.$qlik.generateHypercubeObjectFromDef(
        metricValuesDef
      )
      this.sessionObject.on('changed', this.update)

      this.schoolReport = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'schoolReport' }
      )
      this.srcschoolid = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'srcschoolid' }
      )
      this.schoolName = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'schoolName' }
      )
      this.reportName = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'reportName' }
      )

      const selectedValues = {}
      selectedValues.schoolReport = await this.$qlik.selectFieldValues(
        'School Name (Reporting Category)',
        [{ text: this.schoolReport }]
      )
      await this.$store.dispatch(
        'selections/set_current_selections',
        selectedValues
      )

      this.update()
    },

    async update() {
      if (this.sessionObject) {
        this.metricValues = await this.$qlik.getValuesFromHypercubeObject(
          this.sessionObject
        )
        this.metricIds = await this.$qlik.lookupValueByMultipleFieldValues(
          this.metricValues,
          { domainName: this.currentDomain, isMetric: true },
          'metricId',
          true,
          'text'
        )
        // isMetricUsed can be switched by user, initialize based on possible points
        this.metricValues.metricId.forEach(({ text: metricId }) => {
          this.isMetricUsed[metricId] = this.wasUsedByMetricId(metricId)
        })

        // add a deep copy of the score field as projected scores
        this.metricValues.score.forEach((v, metricIndex) => {
          this.updateProjectedValuesAtIndex(metricIndex, v.number, true)
        })

        // for each of the domain calculate rollup values based upon projected values
        this.updateProjectedRollUpValues('Achievement', true)
        this.updateProjectedRollUpValues('Progress', true)
        this.updateProjectedRollUpValues('Climate', true)
        this.updateProjectedRollUpValues('College & Career', true)
        this.updateProjectedRollUpValues('Overall', true)
      }
    },

    destroy() {
      if (this.sessionObject) {
        this.sessionObject.removeListener('changed', this.update)
        this.$qlik.destroySessionObject(this.sessionObject)
      }
    },

    launchTour() {
      this.$tours.calculatorTour.start()
    },

    mapDomainToId(domain) {
      if (domain === 'Overall') {
        return 'Z_OVERALL_OVERALL'
      } else if (domain === 'Achievement') {
        return 'Z_ACH_OVERALL'
      } else if (domain === 'Progress') {
        return 'Z_PROG_OVERALL'
      } else if (domain === 'Climate') {
        return 'Z_CLIM_OVERALL'
      } else if (domain === 'College & Career') {
        return 'Z_CC_OVERALL'
      }
    },

    mapIdToDomain(metricId) {
      if (metricId === 'Z_OVERALL_OVERALL') {
        return 'Overall'
      } else if (metricId === 'Z_ACH_OVERALL') {
        return 'Achievement'
      } else if (metricId === 'Z_PROG_OVERALL') {
        return 'Progress'
      } else if (metricId === 'Z_CLIM_OVERALL') {
        return 'Climate'
      } else if (metricId === 'Z_CC_OVERALL') {
        return 'College & Career'
      }
    },

    getMinNeededPointsPossible(metricId) {
      if (this.metricValues) {
        const possiblePoints = this.$qlik.lookupValueByFieldValue(
          this.metricValues,
          'metricId',
          metricId,
          'possiblePointsMax',
          false,
          'number'
        )
        if (isFinite(possiblePoints) && possiblePoints > 0) {
          return possiblePoints / 2
        } else {
          return NaN
        }
      } else {
        return null
      }
    },

    getCalculatedPointsPossible(metricId) {
      if (this.metricValues) {
        const domain = this.mapIdToDomain(metricId)
        let metricIds
        if (domain === 'Overall') {
          metricIds = this.$qlik.lookupValueByFieldValue(
            this.metricValues,
            'isDomain',
            0,
            'metricId',
            true,
            'text'
          )
        } else {
          metricIds = this.$qlik.lookupValueByMultipleFieldValues(
            this.metricValues,
            { isMetric: 1, domainName: domain },
            'metricId',
            true,
            'text'
          )
        }

        const possiblePoints = metricIds.map(id =>
          this.$qlik.lookupValueByFieldValue(
            this.metricValues,
            'metricId',
            id,
            'possiblePoints',
            false,
            'number'
          )
        )

        return (
          Math.round(
            100 *
              possiblePoints.reduce(
                (acc, val) =>
                  acc + (isFinite(parseFloat(val)) ? parseFloat(val) : 0),
                0
              )
          ) / 100
        )
      } else {
        return null
      }
    },

    getCalculatedPointsEarned(metricId) {
      if (this.metricValues) {
        const domain = this.mapIdToDomain(metricId)
        let metricIds
        if (domain === 'Overall') {
          metricIds = this.$qlik.lookupValueByFieldValue(
            this.metricValues,
            'isDomain',
            0,
            'metricId',
            true,
            'text'
          )
        } else {
          metricIds = this.$qlik.lookupValueByMultipleFieldValues(
            this.metricValues,
            { isMetric: 1, domainName: domain },
            'metricId',
            true,
            'text'
          )
        }

        const pointsEarned = metricIds.map(id =>
          this.$qlik.lookupValueByFieldValue(
            this.metricValues,
            'metricId',
            id,
            'pointsEarned',
            false,
            'number'
          )
        )

        return (
          Math.round(
            100 *
              pointsEarned.reduce(
                (acc, val) =>
                  acc + (isFinite(parseFloat(val)) ? parseFloat(val) : 0),
                0
              )
          ) / 100
        )
      } else {
        return null
      }
    },

    getProjectedValue(metricId, type) {
      // has this been initialized
      if (
        this.percEarnedProjected != null &&
        Object.keys(this.percEarnedProjected).length > 0
      ) {
        if (type === 'scoreProjected') {
          return this.scoreProjected[metricId]
        } else if (type === 'percEarnedProjected') {
          return this.percEarnedProjected[metricId]
        } else if (type === 'pointsEarnedProjected') {
          return this.pointsEarnedProjected[metricId]
        } else if (type === 'pointsEarnedProjectedCalculated') {
          return this.pointsEarnedProjectedCalculated[metricId]
        } else if (type === 'possiblePointsProjected') {
          return this.possiblePointsProjected[metricId]
        } else if (type === 'maxPossiblePointsProjected') {
          return this.maxPossiblePointsProjected[metricId]
        } else if (type === 'isMetricUsed') {
          return this.isMetricUsed[metricId]
        } else {
          return null
        }
      } else {
        return null
      }
    },

    getSPRColorByValue(textVal) {
      let val
      if (typeof textVal === 'string') {
        val = parseFloat(textVal)
      } else {
        val = textVal
        val = 100 * val
      }
      if (val < 25) {
        return '#c0504d'
      } else if (val < 50) {
        return '#f79646'
      } else if (val < 75) {
        return '#00b050'
      } else if (val >= 75) {
        return '#0070c0'
      } else {
        return '#888888'
      }
    },

    getSPRTierByValue(textVal) {
      let val
      if (typeof textVal === 'string') {
        val = parseFloat(textVal)
      } else {
        val = textVal
        val = 100 * val
      }
      // console.log("this val for tier", val, textVal)
      if (val < 25) {
        return 'Intervene'
      } else if (val < 50) {
        return 'Watch'
      } else if (val < 75) {
        return 'Reinforce'
      } else if (val >= 75) {
        return 'Model'
      } else {
        return null
      }
    },

    /**
     * Was this metric used in the original report
     */
    wasUsedByMetricId(metricId) {
      if (this.metricValues) {
        const possiblePoints = this.$qlik.lookupValueByFieldValue(
          this.metricValues,
          'metricId',
          metricId,
          'possiblePoints',
          false,
          'number'
        )
        return isFinite(possiblePoints) && possiblePoints > 0
      } else {
        return null
      }
    },

    isApplicableByMetricId(metricId) {
      if (this.metricValues) {
        const exception = this.$qlik.lookupValueByFieldValue(
          this.metricValues,
          'metricId',
          metricId,
          'exception',
          false,
          'number'
        )
        const possiblePoints = this.$qlik.lookupValueByFieldValue(
          this.metricValues,
          'metricId',
          metricId,
          'possiblePointsMax',
          false,
          'number'
        )

        if (exception === 999) {
          return false
        } else if (isFinite(possiblePoints) && possiblePoints > 0) {
          return true
        } else {
          return false
        }
      } else {
        return null
      }
    },

    lookupIndexByMetricId(metricId) {
      return this.$qlik.lookupIndexByFieldValue(
        this.metricValues,
        'metricId',
        metricId,
        false
      )
    },

    resetProjectedMetric(metricId) {
      // tell the slider to reset
      const metricIndex = this.lookupIndexByMetricId(metricId)
      let scoreProjected = this.metricValues.score[metricIndex].number
      scoreProjected = isFinite(scoreProjected) ? scoreProjected : 0
      this.updateProjectedValuesAtIndex(metricIndex, scoreProjected, true)
      this.$refs['slider-projected-' + metricId][0].reset(scoreProjected)
      this.updateProjectedRollUpValues(this.currentDomain)
      this.updateProjectedRollUpValues('Overall')
      this.$forceUpdate()
    },

    resetProjectedDomain(domain) {
      // if this is the current domain, then reset all timelines
      if (domain === this.currentDomain || domain === 'Overall') {
        this.applicableMetricIds.forEach(metricId => {
          // first update projected score back to default, then reset slider
          const metricIndex = this.lookupIndexByMetricId(metricId)
          let scoreProjected = this.metricValues.score[metricIndex].number
          scoreProjected = isFinite(scoreProjected) ? scoreProjected : 0
          this.updateProjectedValuesAtIndex(metricIndex, scoreProjected, true)
          const refs = this.$refs['slider-projected-' + metricId]
          if (refs?.length > 0 && refs[0].reset) {
            refs[0].reset(scoreProjected)
          }
        })
      }
      if (domain !== 'Overall') {
        this.updateProjectedRollUpValues(domain)
      } else {
        this.updateProjectedRollUpValues('Achievement')
        this.updateProjectedRollUpValues('Progress')
        this.updateProjectedRollUpValues('Climate')
        this.updateProjectedRollUpValues('College & Career')
      }
      this.updateProjectedRollUpValues('Overall')
      this.$forceUpdate()
    },

    updateIsMetricUsed(metricId, value) {
      this.isMetricUsed[metricId] = value
      this.updateProjectedValuesByMetricId(metricId, 0, true)
    },

    async updateCurrentDomain(domain) {
      this.currentDomain = domain
      this.metricIds = await this.$qlik.lookupValueByMultipleFieldValues(
        this.metricValues,
        { domainName: this.currentDomain, isMetric: true },
        'metricId',
        true,
        'text'
      )
    },

    updateProjectedValuesByMetricId(metricId, scoreProjected, doRollup) {
      const metricIndex = this.lookupIndexByMetricId(metricId)
      // console.log("update metric", metricId, "index:", metricIndex, "to", scoreProjected)
      this.updateProjectedValuesAtIndex(metricIndex, scoreProjected)
      if (doRollup) {
        // the domain must come before overall because
        // overall pulls the calculated score of each of the domains, not all the individual metrics
        this.updateProjectedRollUpValues(this.currentDomain)
        this.updateProjectedRollUpValues('Overall')
        this.$forceUpdate()
      }
    },

    updateProjectedValuesAtIndex(
      metricIndex,
      scoreProjected,
      useDefaultValues
    ) {
      let points, perc, pointsEarnedCalculated
      const metricId = this.metricValues.metricId[metricIndex].text
      const isAgi = this.metricValues.isAgi[metricIndex].number === 1
      const wasUsed = this.wasUsedByMetricId(metricId)
      const isUsed = this.isMetricUsed[metricId]
      // for metrics that were not on the original report but are being used here use the report-level max points
      const possiblePoints = isUsed
        ? this.metricValues.possiblePointsMax[metricIndex].number
        : NaN
      const floor = isUsed
        ? this.metricValues.floorPointsMax[metricIndex].number /
          (isAgi ? 1 : 100)
        : NaN
      const target = isUsed
        ? this.metricValues.targetPointsMax[metricIndex].number /
          (isAgi ? 1 : 100)
        : NaN

      // only use the default values if this metric was actually used
      if (useDefaultValues && wasUsed) {
        perc = this.metricValues.percEarned[metricIndex].number
        points = this.metricValues.pointsEarned[metricIndex].number
        // if there is a numerator and denominator, use that to create a score
        const numerator = this.metricValues.numerator[metricIndex].number
        const denominator = this.metricValues.denominator[metricIndex].number
        if (
          isFinite(parseFloat(numerator)) &&
          isFinite(parseFloat(denominator))
        ) {
          const scoreCalculated = numerator / denominator
          const percEarnedCalculated = Math.min(
            Math.max((scoreCalculated - floor) / (target - floor), 0),
            1
          )
          pointsEarnedCalculated =
            Math.round(1000 * percEarnedCalculated * possiblePoints) / 1000
        } else {
          pointsEarnedCalculated = points
        }
      } else {
        perc = Math.min(
          Math.max((scoreProjected - floor) / (target - floor), 0),
          1
        )
        points = perc * possiblePoints
        pointsEarnedCalculated = points
      }

      // use $set to let Vue know that we've updated a value
      this.$set(this.scoreProjected, metricId, scoreProjected)
      this.$set(this.percEarnedProjected, metricId, perc)
      this.$set(this.pointsEarnedProjected, metricId, points)
      this.$set(
        this.pointsEarnedProjectedCalculated,
        metricId,
        pointsEarnedCalculated
      )
      this.$set(this.possiblePointsProjected, metricId, possiblePoints)
    },

    updateProjectedRollUpValues(domain, useDefaultValues) {
      const domainId = this.mapDomainToId(domain)
      const domainIndex = this.lookupIndexByMetricId(domainId)

      let pointsEarned, possiblePoints
      let perc = this.metricValues.percEarned[domainIndex].number
      if (useDefaultValues && isFinite(perc)) {
        possiblePoints = this.metricValues.possiblePoints[domainIndex].number
        pointsEarned = this.metricValues.pointsEarned[domainIndex].number
      } else {
        let metricIds, pointsEarnedProjected, possiblePointsProjected
        if (domain === 'Overall') {
          metricIds = this.$qlik.lookupValueByFieldValue(
            this.metricValues,
            'isDomain',
            1,
            'metricId',
            true,
            'text'
          )
          pointsEarnedProjected = metricIds.map(
            id => this.pointsEarnedProjected[id]
          )
          possiblePointsProjected = metricIds.map(
            id => this.possiblePointsProjected[id]
          )
        } else {
          metricIds = this.$qlik.lookupValueByMultipleFieldValues(
            this.metricValues,
            { isMetric: 1, domainName: domain },
            'metricId',
            true,
            'text'
          )
          pointsEarnedProjected = metricIds.map(
            id => this.pointsEarnedProjectedCalculated[id]
          )
          possiblePointsProjected = metricIds.map(
            id => this.possiblePointsProjected[id]
          )
        }

        pointsEarned =
          Math.round(
            100 *
              pointsEarnedProjected.reduce(
                (acc, val) =>
                  acc + (isFinite(parseFloat(val)) ? parseFloat(val) : 0),
                0
              )
          ) / 100
        possiblePoints =
          Math.round(
            100 *
              possiblePointsProjected.reduce(
                (acc, val) =>
                  acc + (isFinite(parseFloat(val)) ? parseFloat(val) : 0),
                0
              )
          ) / 100
        perc = pointsEarned / possiblePoints
        perc = Math.round(100 * perc) / 100
      }
      // console.log("points", domain, domainIndex, pointsEarned, possiblePoints, perc) //projected_points,

      // use $set to let Vue know that we've updated a value
      this.$set(this.percEarnedProjected, domainId, perc)
      this.$set(this.pointsEarnedProjected, domainId, pointsEarned)
      this.$set(this.possiblePointsProjected, domainId, possiblePoints)
    },

    // import formatValue as method and filter
    formatValue
  }
}
</script>
<style lang="postcss" scoped>
.blink {
  animation-name: blink-in;
  animation-duration: 2s;
  animation-delay: 2s;
  animation-timing-function: linear;
}

@keyframes blink-in {
  0% {
    background-color: white;
  }
  10% {
    background-color: #e2e8f0;
  }
  20% {
    background-color: white;
  }
  30% {
    background-color: #e2e8f0;
  }
  40% {
    background-color: white;
  }
  50% {
    background-color: #e2e8f0;
  }
  60% {
    background-color: white;
  }
  70% {
    background-color: #e2e8f0;
  }
  80% {
    background-color: white;
  }
  90% {
    background-color: #e2e8f0;
  }
  100% {
    background-color: white;
  }
}

.h1,
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
  @apply font-semibold bg-gray-200;
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
