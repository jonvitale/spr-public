<template>
  <div class="flex flex-wrap lg:flex-no-wrap">
    <div
      v-if="!print"
      class="w-full lg:w-1/5 text-left lg:h-screen sticky top-0"
    >
      <div class="hidden lg:block">
        <ScrollSpyNav
          class="bg-blue-100"
          title="Sections"
          :refs="[
            's-overview',
            's-achievement',
            's-progress',
            's-climate',
            's-cc',
            's-ee'
          ]"
          :target="current"
          orientation="col"
        />
        <QlikFilter
          style="max-height: 400px"
          title="Change School Report"
          field="School Name (Reporting Category)"
          filtering-measure="Count(distinct {1<YearEnd={$(=$(v_Max_YearEnd))}>} 1)"
          prevent-multiple-selections
          prevent-no-selections
          prevent-exclusion-style
          @change="handleSchoolReportSelection"
        />
      </div>
      <div class="block lg:hidden">
        <!-- v-else -->
        <ScrollSpyNav
          class="bg-blue-100"
          title="Sections"
          :refs="[
            's-overview',
            's-achievement',
            's-progress',
            's-climate',
            's-cc',
            's-ee'
          ]"
          :target="current"
          orientation="row"
        />
        <div class="mt-1">
          <nuxt-link
            :to="'/report'"
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
      </div>
    </div>

    <div ref="scrollSpyTarget" class="bg-white w-full lg:w-4/5 lg:pl-2">
      <section ref="s-overview" name="Overview" class="px-8 py-4 lg:pt-0">
        <div class="flex mb-4 px-4 w-full bg-black text-white text-2xl ">
          <p>{{ $store.getters.sy_c }} School Progress Report</p>
        </div>
        <div>
          <h1>{{ schoolName }}</h1>
          <div class="flex flex-wrap pl-2 mb-8 text-sm">
            <div class="flex-col md:w-1/2">
              <div class="flex">
                <div class="flex-shrink w-40 text-gray-600">
                  <p>School Code</p>
                  <p>Sector</p>
                  <p>Address</p>
                  <p>Phone/Fax</p>
                  <p>Zip Code</p>
                  <p>Website</p>
                </div>
                <div class="flex-grow text-black">
                  <p>{{ srcschoolid }}</p>
                  <p>{{ governance }}</p>
                  <p>{{ address }}</p>
                  <p>{{ phone }} / {{ fax }}</p>
                  <p>{{ zipCode }}</p>
                  <a :href="urlSchool" target="_blank">
                    {{ urlSchool }}
                  </a>
                </div>
              </div>
            </div>
            <div class="flex-col md:w-1/2">
              <div class="flex">
                <div class="flex-shrink w-40 text-gray-600">
                  <p>Report Type</p>
                  <p>Grades in Report</p>
                  <p>Enrollment</p>
                  <p>Admissions Category</p>
                  <p>Turnaround Model</p>
                </div>
                <div class="flex-grow text-black">
                  <p>{{ reportName }}</p>
                  <p>{{ gradesServed }}</p>
                  <p>{{ enrollment }}</p>
                  <p>{{ admissionType }}</p>
                  <p>{{ turnaround }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2>Performance Tiers</h2>
          <div class="flex flex-wrap justify-between my-4">
            <h4 class="spr-intervene">
              <span class="box bg-spr-intervene"> </span>&nbsp;INTERVENE (0-24%)
            </h4>
            <h4 class="spr-watch">
              <span class="box bg-spr-watch"> </span>&nbsp;WATCH (25-49%)
            </h4>
            <h4 class="spr-reinforce">
              <span class="box bg-spr-reinforce"> </span>&nbsp;REINFORCE
              (50-74%)
            </h4>
            <h4 class="spr-model">
              <span class="box bg-spr-model"> </span>&nbsp;MODEL (75-100%)
            </h4>
          </div>
        </div>
        <div class="hidden lg:flex justify-between text-center">
          <div class="w-1/3">&nbsp;</div>
          <div style="width:350px">
            <!-- if using the app object use  pl-8  -->
            <div class="mt-2 ml-2 flex flex-no-wrap justify-around">
              <h4 class="inline">{{ $store.getters.sy_pp }}</h4>
              <h4 class="inline">{{ $store.getters.sy_p }}</h4>
              <h4 class="inline">{{ $store.getters.sy_c }}</h4>
            </div>
          </div>
          <div class="w-36">
            <h4>3 YEAR AVG</h4>
          </div>
        </div>
        <hr />
        <!-- for front page repeat the following for each of the domains, including overall -->
        <div v-for="domain in domainFacts" :key="domain.key" class="my-4">
          <div
            v-if="
              domain.key !== 'ee' &&
                (domain.key !== 'cc' || reportName === 'High School')
            "
          >
            <div class="flex flex-wrap lg:flex-no-wrap justify-between">
              <div class="w-auto mb-2 lg:w-1/3 lg:mb-0">
                <p
                  class="text-xl font-bold lg:w-full lg:mb-4"
                  :class="{ 'text-2xl': domain.key === 'overall' }"
                >
                  {{ domain.title }}:
                  <span
                    v-if="
                      isFinite(
                        lookupNumberByFieldValue(
                          'metricId',
                          domain.metricId,
                          'perc_earned'
                        )
                      )
                    "
                    :style="{
                      color: getSPRColorByTextValue(
                        lookupTextByFieldValue(
                          'metricId',
                          domain.metricId,
                          'perc_earned'
                        )
                      )
                    }"
                  >
                    {{
                      lookupTextByFieldValue(
                        'metricId',
                        domain.metricId,
                        'tier'
                      ).toUpperCase()
                    }}
                    ({{
                      lookupTextByFieldValue(
                        'metricId',
                        domain.metricId,
                        'perc_earned'
                      )
                    }})
                  </span>
                  <span v-else class="text-gray-500 text-lg uppercase">
                    Insufficient Data
                  </span>
                </p>
                <p class="text-sm lg:w-full">
                  {{ domain.description }}
                </p>
              </div>
              <!-- <div style="width: 300px; height: 150px;"> -->
              <div style="width:350px">
                <!-- if using the app object use  pl-8  -->
                <div
                  class="flex flex-no-wrap justify-around lg:hidden mt-2 ml-2"
                >
                  <h4 class="inline">{{ $store.getters.sy_pp }}</h4>
                  <h4 class="inline">{{ $store.getters.sy_p }}</h4>
                  <h4 class="inline">{{ $store.getters.sy_c }}</h4>
                </div>
                <!-- <QdtComponent :qdtAPI="$qdt" :type="qObjs[domain.key].trend.type" :props="qObjs[domain.key].trend.props" />    -->
                <LineChart
                  :point-heights="[
                    lookupNumberByFieldValue(
                      'metricId',
                      domain.metricId,
                      'perc_earned_ppy'
                    ),
                    lookupNumberByFieldValue(
                      'metricId',
                      domain.metricId,
                      'perc_earned_py'
                    ),
                    lookupNumberByFieldValue(
                      'metricId',
                      domain.metricId,
                      'perc_earned'
                    )
                  ]"
                />
              </div>
              <div class="w-36 text-center ml-2 pl-8 md:ml-0 md:pl-0">
                <h4 class="lg:invisible mt-2">3 YEAR AVG</h4>
                <p class="label-3year">
                  {{
                    lookupTextByFieldValue(
                      'metricId',
                      domain.metricId,
                      'perc_earned_3year',
                      'N / A'
                    )
                  }}
                </p>
              </div>
            </div>
            <div class="flex mt-4">
              <hr class="w-full light" />
            </div>
          </div>
        </div>
      </section>

      <!-- for domain pages repeat the following for each of the domains, not overall and not educator effectiveness  -->
      <div
        v-for="domain in domainFacts.filter(
          domain =>
            domain.key != 'overall' &&
            domain.key != 'ee' &&
            (domain.key !== 'cc' || reportName === 'High School')
        )"
        :key="domain.key"
      >
        <!-- <div v-if="domain.key !== 'cc' || reportName === 'High School'"> -->
        <!-- page separator -->
        <section v-if="!print" class="pt-8">
          <hr class="w-full page" />
        </section>
        <section
          :ref="'s-' + domain.key"
          :name="domain.title"
          class="px-8 my-4 pt-4"
        >
          <!-- page header -->
          <div class="flex justify-between my-4 pt-6 w-full text-lg ">
            <p class="text-gray-600">
              {{ $store.getters.sy_c }} School Progress Report
            </p>
            <p class="text-black font-bold">{{ schoolName }}</p>
          </div>
          <div class="flex mt-4">
            <hr class="w-full dark" />
          </div>
          <!-- domain header -->
          <div>
            <p class="text-xl text-black font-bold">{{ domain.title }}</p>
            <div class="flex justify-between mt-2 text-gray-600">
              <p class="w-full lg:w-1/3">METRIC</p>
              <p class="w-full lg:w-48 text-center">METRIC SCORE</p>
              <p class="w-full lg:w-48 text-center">POINTS EARNED</p>
              <p class="w-full lg:w-1/4 text-center">TIER</p>
            </div>
          </div>
          <div class="flex mt-2">
            <hr class="w-full light" />
          </div>
          <!-- metrics -->
          <div
            v-for="(metricGroup,
            metricGroup_index) in filterMetricGroupsByDomain(domain)"
            :key="metricGroup.key"
          >
            <!-- if there are no metrics treat this as a sub-section header -->
            <p
              v-if="metricGroup.title"
              :class="[
                metricGroup.metrics ? 'text-gray-600' : 'text-gray-800',
                metricGroup.metrics ? 'text-base' : 'text-2xl'
              ]"
            >
              {{ metricGroup.title }}
            </p>
            <div v-if="metricGroup.metrics">
              <div v-for="metric in metricGroup.metrics" :key="metric.metricId">
                <!-- v-if="lookupNumberByFieldValue('metricId', metric.metricId, 'exception') == null ||
                              lookupNumberByFieldValue('metricId', metric.metricId, 'exception') != 999"  -->
                <div
                  v-if="isApplicableByMetricId(metric.metricId)"
                  class="flex justify-between mb-2"
                >
                  <div class="w-full lg:w-1/3" style="min-height:50px">
                    <p v-if="metric.title" class="text-black text-base">
                      {{ metric.title }}
                    </p>
                    <p
                      class="text-sm"
                      :class="[
                        lookupNumberByFieldValue(
                          'metricId',
                          metric.metricId,
                          'points_possible'
                        ) > 0
                          ? 'text-black'
                          : 'text-gray-600',
                        metricGroup.metrics.length == 1 ? 'pl-0' : 'pl-6'
                      ]"
                    >
                      {{ metric.subtitle }}
                    </p>
                  </div>
                  <div
                    class="w-full lg:w-48 text-center"
                    :class="
                      lookupNumberByFieldValue(
                        'metricId',
                        metric.metricId,
                        'points_possible'
                      ) > 0
                        ? 'text-black'
                        : 'text-gray-600'
                    "
                  >
                    <p
                      v-if="
                        lookupNumberByFieldValue(
                          'metricId',
                          metric.metricId,
                          'exception'
                        ) > 0
                      "
                    >
                      &nbsp;
                    </p>
                    <p v-else>
                      <span class="text-xl">
                        {{
                          lookupTextByFieldValue(
                            'metricId',
                            metric.metricId,
                            'score'
                          )
                        }}
                      </span>
                      <br />
                      <span
                        v-if="
                          lookupNumberByFieldValue(
                            'metricId',
                            metric.metricId,
                            'denominator'
                          ) > 0
                        "
                      >
                        ({{
                          lookupTextByFieldValue(
                            'metricId',
                            metric.metricId,
                            'denominator'
                          )
                        }}
                        students)
                      </span>
                    </p>
                  </div>
                  <div class="w-full lg:w-48 text-center">
                    <p
                      v-if="
                        lookupNumberByFieldValue(
                          'metricId',
                          metric.metricId,
                          'exception'
                        ) > 0
                      "
                    >
                      &nbsp;
                    </p>
                    <p v-else>
                      <span
                        v-if="
                          lookupNumberByFieldValue(
                            'metricId',
                            metric.metricId,
                            'points_possible'
                          ) > 0
                        "
                      >
                        <span class="text-xl text-black"
                          >{{
                            lookupTextByFieldValue(
                              'metricId',
                              metric.metricId,
                              'points_earned'
                            )
                          }}
                        </span>
                        <span class="text-gray-600"> out of </span>
                        <span class="text-xl text-black"
                          >{{
                            lookupTextByFieldValue(
                              'metricId',
                              metric.metricId,
                              'points_possible'
                            )
                          }}
                        </span>
                        <br />
                        <span class="text-black"
                          >({{
                            lookupTextByFieldValue(
                              'metricId',
                              metric.metricId,
                              'perc_earned'
                            )
                          }})</span
                        >
                      </span>
                    </p>
                  </div>
                  <div
                    class="w-full lg:w-1/4 text-center text-lg font-semibold"
                  >
                    <p
                      v-if="
                        lookupNumberByFieldValue(
                          'metricId',
                          metric.metricId,
                          'exception'
                        ) > 0
                      "
                    >
                      <span class="text-gray-800">
                        {{
                          lookupTextByFieldValue(
                            'metricId',
                            metric.metricId,
                            'exception_name'
                          ).toUpperCase()
                        }}
                      </span>
                    </p>
                    <p v-else>
                      <span
                        v-if="
                          lookupNumberByFieldValue(
                            'metricId',
                            metric.metricId,
                            'points_possible'
                          ) > 0
                        "
                        :style="{
                          color: getSPRColorByTextValue(
                            lookupTextByFieldValue(
                              'metricId',
                              metric.metricId,
                              'perc_earned'
                            )
                          )
                        }"
                      >
                        {{
                          lookupTextByFieldValue(
                            'metricId',
                            metric.metricId,
                            'tier'
                          ).toUpperCase()
                        }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex mt-2">
              <hr
                class="w-full"
                :class="
                  metricGroup_index <
                  countApplicableMetricGroupsByDomain(domain) - 1
                    ? 'tint'
                    : 'medium'
                "
              />
            </div>
          </div>
          <!-- domain footer -->
          <div>
            <div class="flex justify-between mt-2 text-center">
              <p class="w-full lg:w-1/3">
                <span class="text-lg text-black font-bold"
                  >{{ domain.title }} Total:
                </span>
                <br />
                <span class="text-base text-gray-600">
                  % of Points Earned
                </span>
              </p>
              <p class="w-full lg:w-48 text-center text-2xl font-bold">
                <span
                  :style="{
                    color: getSPRColorByTextValue(
                      lookupTextByFieldValue(
                        'metricId',
                        domain.metricId,
                        'perc_earned'
                      )
                    )
                  }"
                >
                  {{
                    lookupTextByFieldValue(
                      'metricId',
                      domain.metricId,
                      'perc_earned'
                    )
                  }}
                </span>
              </p>
              <p class="w-full lg:w-48 text-center text-black font-bold">
                <span class="text-xl"
                  >{{
                    isFinite(
                      lookupNumberByFieldValue(
                        'metricId',
                        domain.metricId,
                        'points_earned'
                      )
                    )
                      ? lookupTextByFieldValue(
                          'metricId',
                          domain.metricId,
                          'points_earned'
                        )
                      : getCalculatedPointsEarned(domain.metricId)
                  }}
                </span>
                <span class="text-base text-gray-800"> out of </span>
                <span class="text-xl"
                  >{{
                    isFinite(
                      lookupNumberByFieldValue(
                        'metricId',
                        domain.metricId,
                        'points_possible'
                      )
                    )
                      ? lookupTextByFieldValue(
                          'metricId',
                          domain.metricId,
                          'points_possible'
                        )
                      : getCalculatedPointsPossible(domain.metricId)
                  }}
                </span>
              </p>
              <p class="w-full lg:w-1/4 text-center text-2xl font-bold">
                <span
                  v-if="
                    lookupNumberByFieldValue(
                      'metricId',
                      domain.metricId,
                      'exception'
                    ) > 0
                  "
                >
                  {{
                    lookupTextByFieldValue(
                      'metricId',
                      domain.metricId,
                      'exception_name'
                    ).toUpperCase()
                  }}
                </span>
                <span
                  v-else
                  :style="{
                    color: getSPRColorByTextValue(
                      lookupTextByFieldValue(
                        'metricId',
                        domain.metricId,
                        'perc_earned'
                      )
                    )
                  }"
                >
                  {{
                    lookupTextByFieldValue(
                      'metricId',
                      domain.metricId,
                      'tier'
                    ).toUpperCase()
                  }}
                </span>
              </p>
            </div>
          </div>
        </section>
        <!-- </div> -->
      </div>
      <div>
        <div>
          <section v-if="!print" class="pt-8">
            <hr class="w-full page" />
          </section>
          <section
            ref="s-ee"
            name="Educator Effectiveness"
            class="px-8 my-4 pt-4"
          >
            <!-- page header -->
            <div class="flex justify-between my-4 pt-6 w-full text-lg ">
              <p class="text-gray-600">
                {{ $store.getters.sy_c }} School Progress Report
              </p>
              <p class="text-black font-bold">{{ schoolName }}</p>
            </div>
            <div class="flex mt-4">
              <hr class="w-full dark" />
            </div>
            <!-- domain header -->
            <div>
              <p class="text-xl text-black font-bold">
                EDUCATOR EFFECTIVENESS
              </p>
              <p class="text-black mb-2">
                Teacher effectiveness measures are displayed in the School
                Progress Report, but not included in the SPR rating, to share
                data we have gathered to monitor and support teacher practice.
                This information is also used to develop responsive and
                customized professional learning for teachers to ensure that all
                students have access to great instruction.
                <br />
                <br />
                In addition to other metrics, the SPR includes teachers' overall
                Multiple Measure Summary (MMS) effectiveness ratings. These
                ratings are comprised of teachers' Formal Observation, Student
                Learning Objectives, Teacher-Specific PVAAS, and the
                building-level score from the state of Pennsylvania's School
                Performance Profile (SPP, also known as Act 82).
                <br />
                <br />
                Here are some important details that contextualize the teacher
                effectiveness data reported in the SPR.
              </p>
              <ul class="list-disc pl-8 mb-2 text-black">
                <li class="mb-2">
                  Teachers in a formal observation year who fail to receive a
                  required observation receive a default observation score of 2
                  (Proficient) for any missing observation data, which may
                  inflate the overall scores.
                </li>
                <li class="mb-2">
                  Until District-wide inter-rater reliability norming is held
                  for all principals, observation scores may vary significantly
                  across schools and observers. As a result, comparisons of
                  scores between schools may not be meaningful.
                </li>
                <li class="mb-2">
                  The District's observation tool evaluates 10 components of the
                  Danielson Framework for Teaching. Therefore, comparing SDP's
                  observation scores to scores evaluated against all 22
                  components of the Danielson Framework may not be meaningful.
                </li>
              </ul>
              <h4 class="text-gray-600">
                EDUCATOR EFFECTIVENESS INDICATORS
              </h4>
            </div>
            <div class="flex mt-2">
              <hr class="w-full light" />
            </div>
            <!-- metrics -->
            <div
              v-for="(metricGroup, metricGroup_index) in domainFacts.filter(
                domain => domain.key == 'ee'
              )[0]['metricGroups']"
              :key="metricGroup.key"
            >
              <!-- only include metric groups with valid metrics -->
              <div
                v-if="
                  metricGroup.header ||
                    (metricGroup.metrics &&
                      isApplicableByMetricGroup(metricGroup))
                "
              >
                <!-- if there are no metrics treat this as a sub-section header -->
                <p
                  v-if="metricGroup.title"
                  :class="[
                    metricGroup.metrics ? 'text-gray-600' : 'text-gray-800',
                    metricGroup.metrics ? 'text-base' : 'text-2xl'
                  ]"
                >
                  {{ metricGroup.title }}
                </p>
                <div v-if="metricGroup.metrics">
                  <div
                    v-for="metric in metricGroup.metrics"
                    :key="metric.metricId"
                  >
                    <!-- v-if="lookupNumberByFieldValue('metricId', metric.metricId, 'exception') == null ||
                                lookupNumberByFieldValue('metricId', metric.metricId, 'exception') != 999"  -->
                    <div
                      v-if="isApplicableByMetricId(metric.metricId)"
                      class="flex justify-between mb-2"
                    >
                      <div class="w-full lg:w-2/3" style="min-height:50px;">
                        <p v-if="metric.title" class="text-black text-base">
                          {{ metric.title }}
                        </p>
                        <p class="text-black text-sm">
                          {{ metric.subtitle }}
                        </p>
                      </div>
                      <div class="w-full lg:w-1/3 text-left text-black text-xl">
                        <p
                          v-if="
                            lookupNumberByFieldValue(
                              'metricId',
                              metric.metricId,
                              'exception'
                            ) > 0
                          "
                        >
                          <span class="text-gray-800">
                            {{
                              lookupTextByFieldValue(
                                'metricId',
                                metric.metricId,
                                'exception_name'
                              ).toUpperCase()
                            }}
                          </span>
                        </p>
                        <p v-else>
                          <span>
                            {{
                              lookupTextByFieldValue(
                                'metricId',
                                metric.metricId,
                                'score'
                              )
                            }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex mt-2">
                  <hr
                    class="w-full"
                    :class="
                      metricGroup_index <
                      domainFacts.filter(domain => domain.key == 'ee')[0][
                        'metricGroups'
                      ].length -
                        1
                        ? 'tint'
                        : 'medium'
                    "
                  />
                </div>
              </div>
            </div>
            <div>
              <h5>FOR MORE INFORMATION</h5>
              <p class="text-black">
                More information about the School Progress Reports, including
                the User Guide, Public Business Rules, and FAQ, is available at
                <a
                  class="underline text-blue-500"
                  href="https:/philasd.org/spr"
                  target="_blank"
                  >philasd.org/spr</a
                >.
              </p>

              <h5>NOTES ABOUT ROUNDING</h5>
              <p class="text-black">
                All calculated values in the SPR (metric scores, percent of
                points earned, and points earned) are calculated using unrounded
                values; however, displayed values may differ slightly due to
                rounding for publication purposes.
              </p>
              <h5>UNDERSTANDING DUAL REPORTS</h5>
              <p class="text-black">
                Schools that serve multiple grade spans receive separate SPRs
                for each grade span (for example, a school serving grades 6-12
                receives a Middle School Report and a High School Report). The
                grades included in a particular report are displayed on the top
                right of the cover page.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SelectionsMixin from '~/mixins/SelectionsMixin'
import metricValuesDef from '~/definitions/reportMeasures'
import LineChart from '~sdp-components/SimpleCharts/LineChart'
import ScrollSpyNav from '~sdp-components/Navigation/ScrollSpyNav'
import QlikFilter from '~sdp-components/Qlik/QlikFilter'

const domainFacts = [
  {
    key: 'overall',
    title: 'OVERALL',
    metricId: 'Z_OVERALL_OVERALL',
    description:
      'A school’s overall score represents its combined performance on the Achievement, Progress, Climate, and College & Career (for high schools only) domains.'
  },
  {
    key: 'achievement',
    title: 'Achievement',
    metricId: 'Z_ACH_OVERALL',
    description:
      'The Achievement domain measures performance on standardized assessments, including PSSA, Keystone Exams, ACCESS for ELLs, and reading assessments.',
    metricGroups: [
      {
        key: 'DRA',
        metrics: [
          { title: '% Reading at Grade Level- Grades K-2', metricId: 'DRA' }
        ]
      },
      {
        key: 'PSSA_ELA',
        title: 'PSSA: English Language Arts',
        metrics: [
          {
            subtitle: '% Proficient or Advanced',
            metricId: 'PSSA_PROFADV_ELA'
          },
          {
            subtitle: 'Grade 3 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_ELA_G3'
          },
          {
            subtitle: 'Grade 4 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_ELA_G4'
          },
          {
            subtitle: 'Grade 5 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_ELA_G5'
          },
          {
            subtitle: 'Grade 6 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_ELA_G6'
          },
          {
            subtitle: 'Grade 7 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_ELA_G7'
          },
          {
            subtitle: 'Grade 8 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_ELA_G8'
          },
          { subtitle: '% Advanced', metricId: 'PSSA_ADV_ELA' }
        ]
      },
      {
        key: 'KEYSTONE_LIT',
        title: 'Keystone Exam - Literature',
        metrics: [
          {
            subtitle: '% Proficient or Advanced',
            metricId: 'KEYSTONE_PROFADV_LIT'
          },
          { subtitle: '% Advanced', metricId: 'KEYSTONE_ADV_LIT' }
        ]
      },
      {
        key: 'ACCESS_PROF',
        metrics: [
          {
            title: 'ACCESS for ELLs:',
            subtitle: '% 4.5 or Above',
            metricId: 'ACCESS_PROF'
          }
        ]
      },
      {
        key: 'PSSA_MATH',
        title: 'PSSA: Mathematics',
        metrics: [
          {
            subtitle: '% Proficient or Advanced',
            metricId: 'PSSA_PROFADV_MATH'
          },
          {
            subtitle: 'Grade 3 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_MATH_G3'
          },
          {
            subtitle: 'Grade 4 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_MATH_G4'
          },
          {
            subtitle: 'Grade 5 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_MATH_G5'
          },
          {
            subtitle: 'Grade 6 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_MATH_G6'
          },
          {
            subtitle: 'Grade 7 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_MATH_G7'
          },
          {
            subtitle: 'Grade 8 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_MATH_G8'
          },
          { subtitle: '% Advanced', metricId: 'PSSA_ADV_MATH' }
        ]
      },
      {
        key: 'KEYSTONE_ALG1',
        title: 'Keystone Exam - Algebra I',
        metrics: [
          {
            subtitle: '% Proficient or Advanced',
            metricId: 'KEYSTONE_PROFADV_ALG1'
          },
          {
            subtitle: 'Grade 9 - % Proficient or Advanced',
            metricId: 'KEYSTONE_PROFADV_ALG1_G9'
          },
          { subtitle: '% Advanced', metricId: 'KEYSTONE_ADV_ALG1' }
        ]
      },
      {
        key: 'PSSA_SCI',
        title: 'PSSA: Science',
        metrics: [
          {
            subtitle: '% Proficient or Advanced',
            metricId: 'PSSA_PROFADV_SCI'
          },
          {
            subtitle: 'Grade 4 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_SCI_G4'
          },
          {
            subtitle: 'Grade 8 - % Proficient or Advanced',
            metricId: 'PSSA_PROFADV_SCI_G8'
          },
          { subtitle: '% Advanced', metricId: 'PSSA_ADV_SCI' }
        ]
      },
      {
        key: 'KEYSTONE_BIO',
        title: 'Keystone Exam - Biology',
        metrics: [
          {
            subtitle: '% Proficient or Advanced',
            metricId: 'KEYSTONE_PROFADV_BIO'
          },
          { subtitle: '% Advanced', metricId: 'KEYSTONE_ADV_BIO' }
        ]
      }
    ]
  },
  {
    key: 'progress',
    title: 'Progress',
    metricId: 'Z_PROG_OVERALL',
    description:
      'The Progress domain measures growth on standardized assessments and progress towards graduation (for high schools only).',
    metricGroups: [
      {
        key: 'PSSA_MATH_AGI',
        metrics: [
          {
            title: 'PSSA Mathematics:',
            subtitle: 'Average Growth Index (AGI)',
            metricId: 'PSSA_MATH_AGI'
          }
        ]
      },
      {
        key: 'PSSA_ELA_AGI',
        metrics: [
          {
            title: 'PSSA English Language Arts:',
            subtitle: 'Average Growth Index (AGI)',
            metricId: 'PSSA_ELA_AGI'
          }
        ]
      },
      {
        key: 'PSSA_GR_4_SCIENCE_AGI',
        metrics: [
          {
            title: 'PSSA Science (Grade 4):',
            subtitle: 'Average Growth Index (AGI)',
            metricId: 'PSSA_GR_4_SCIENCE_AGI'
          }
        ]
      },
      {
        key: 'PSSA_GR_8_SCIENCE_AGI',
        metrics: [
          {
            title: 'PSSA Science (Grade 8):',
            subtitle: 'Average Growth Index (AGI)',
            metricId: 'PSSA_GR_8_SCIENCE_AGI'
          }
        ]
      },
      {
        key: 'KEYSTONE_ALG1_AGI',
        metrics: [
          {
            title: 'Keystone Exam - Algebra I:',
            subtitle: 'Average Growth Index (AGI)',
            metricId: 'KEYSTONE_ALGEBRA_I_AGI'
          }
        ]
      },
      {
        key: 'KEYSTONE_BIO_AGI',
        metrics: [
          {
            title: 'Keystone Exam - Biology:',
            subtitle: 'Average Growth Index (AGI)',
            metricId: 'KEYSTONE_BIOLOGY_AGI'
          }
        ]
      },
      {
        key: 'KEYSTONE_LIT_AGI',
        metrics: [
          {
            title: 'Keystone Exam - Literature:',
            subtitle: 'Average Growth Index (AGI)',
            metricId: 'KEYSTONE_LITERATURE_AGI'
          }
        ]
      },
      {
        key: 'STAY_ON_TRACK',
        metrics: [
          {
            title: '% of On-Track Students',
            subtitle: 'Earning Credits Required for Promotion',
            metricId: 'STAY_ON_TRACK'
          }
        ]
      },
      {
        key: 'BACK_ON_TRACK',
        metrics: [
          {
            title: '% of Off-Track Students',
            subtitle: 'Earning Credits Required for Promotion',
            metricId: 'BACK_ON_TRACK'
          }
        ]
      },
      {
        key: 'ACCESS_GROWTH',
        metrics: [
          {
            title: 'ACCESS for ELLs',
            subtitle: '% Growth in 60th Percentile or Above',
            metricId: 'ACCESS_GROWTH'
          }
        ]
      },
      {
        key: 'EQUITY_HEADER',
        title: 'Progress, On Equity',
        header: true
      },
      {
        key: 'PSSA_MATH_AGI_L33P',
        metrics: [
          {
            title: 'PSSA Mathematics: ',
            subtitle: 'AGI for Lowest-Performing 33% of Students',
            metricId: 'PSSA_MATH_AGI_L33P'
          }
        ]
      },
      {
        key: 'PSSA_ELA_AGI_L33P',
        metrics: [
          {
            title: 'PSSA English Language Arts: ',
            subtitle: 'AGI for Lowest-Performing 33% of Students',
            metricId: 'PSSA_ELA_AGI_L33P'
          }
        ]
      },
      {
        key: 'KEYSTONE_ALG1_AGI_L33P',
        metrics: [
          {
            title: 'Keystone Exam - Algebra I: ',
            subtitle: 'AGI for Lowest-Performing 33% of Students',
            metricId: 'KEYSTONE_ALG1_AGI_L33P'
          }
        ]
      },
      {
        key: 'KEYSTONE_BIO_AGI_L33P',
        metrics: [
          {
            title: 'Keystone Exam - Biology: ',
            subtitle: 'AGI for Lowest-Performing 33% of Students',
            metricId: 'KEYSTONE_BIO_AGI_L33P'
          }
        ]
      },
      {
        key: 'KEYSTONE_LIT_AGI_L33P',
        metrics: [
          {
            title: 'Keystone Exam - Literature: ',
            subtitle: 'AGI for Lowest-Performing 33% of Students',
            metricId: 'KEYSTONE_LIT_AGI_L33P'
          }
        ]
      }
    ]
  },
  {
    key: 'climate',
    title: 'Climate',
    metricId: 'Z_CLIM_OVERALL',
    description:
      'The Climate domain measures school climate and student and parent/guardian engagement.',
    metricGroups: [
      {
        key: 'ATTENDANCE',
        metrics: [
          {
            title: '% of Students Attending 95% or More of Instructional Days',
            metricId: 'ATTENDANCE_95MORE'
          },
          {
            subtitle: '% Attending 90% to 95% of days',
            metricId: 'ATTENDANCE_9095'
          },
          {
            subtitle: '% Attending 85% to 90% of days',
            metricId: 'ATTENDANCE_8590'
          },
          {
            subtitle: '% Attending 80% to 85% of days',
            metricId: 'ATTENDANCE_8085'
          },
          {
            subtitle: '% Attending less than 80% of days',
            metricId: 'ATTENDANCE_LT80'
          }
        ]
      },
      {
        key: 'RETENTION',
        metrics: [{ title: 'Annual Retention Rate', metricId: 'RETENTION' }]
      },
      {
        key: 'ISS',
        metrics: [
          {
            title: '% of Students with Zero In-School Suspensions',
            metricId: 'ISS'
          }
        ]
      },
      {
        key: 'OSS',
        metrics: [
          {
            title: '% of Students with Zero Out-of-School Suspensions',
            metricId: 'OSS'
          }
        ]
      },
      {
        key: 'SVY_CLIM_STUD',
        metrics: [
          {
            title:
              'Student Survey: School Climate Rating (% most positive responses)',
            metricId: 'SVY_CLIM_STUD'
          }
        ]
      },
      {
        key: 'SVY_CLIM_PAR',
        metrics: [
          {
            title:
              'Parent Survey: School Climate Rating (% most positive responses)',
            metricId: 'SVY_CLIM_PAR'
          }
        ]
      },
      {
        key: 'SVY_PARENT_RATE',
        metrics: [
          {
            title: 'Parent/Guardian Survey: Participation Rate',
            metricId: 'SVY_PARENT_RATE'
          }
        ]
      }
    ]
  },
  {
    key: 'cc',
    title: 'College & Career',
    title_style: { fontSize: '16pt', fontWeight: 700 },
    metricId: 'Z_CC_OVERALL',
    description:
      'The College & Career domain measures college and career readiness and post-secondary outcomes.',
    metricGroups: [
      {
        key: 'GRAD',
        metrics: [
          { title: 'Four-Year Cohort Graduation Rate', metricId: 'GRAD' }
        ]
      },
      {
        key: 'FF_MATRIC',
        metrics: [
          {
            title: 'First-Fall College Matriculation Rate',
            metricId: 'FF_MATRIC'
          }
        ]
      },
      {
        key: 'AP_IB_NOCTI',
        metrics: [
          {
            title: 'SAT & ACT Exams Participation & Performance',
            metricId: 'AP_IB_NOCTI'
          },
          {
            subtitle: '% Participating Not Meeting Threshold',
            metricId: 'AP_IB_NOCTI_NOTPASS'
          },
          {
            subtitle: '% Not Participating',
            metricId: 'AP_IB_NOCTI_NOTPARTICIPATE'
          }
        ]
      },
      {
        key: 'ACT_SAT',
        metrics: [
          {
            title: 'SAT & ACT Exams Participation & Performance',
            metricId: 'ACT_SAT'
          },
          {
            subtitle: '% Participating Not Meeting Threshold',
            metricId: 'ACT_SAT_NOTPASS'
          },
          {
            subtitle: '% Not Participating',
            metricId: 'ACT_SAT_NOTPARTICIPATE'
          }
        ]
      },
      {
        key: 'FAFSA',
        metrics: [{ title: 'FAFSA Completion Rate', metricId: 'FAFSA' }]
      },
      {
        key: 'SVY_STUD_CCR',
        metrics: [
          {
            title: 'Student Survey:',
            subtitle:
              'College & Career Readiness Rating (% most positive responses)',
            metricId: 'SVY_STUD_CCR'
          }
        ]
      }
    ]
  },
  {
    key: 'ee',
    title: 'Educator Effectiveness',
    metricGroups: [
      {
        key: 'MMS_DISTIN',
        metrics: [
          {
            title: '% of Teachers Receiving an MMS Rating of Distinguished',
            metricId: 'MMS_DISTIN'
          }
        ]
      },
      {
        key: 'MMS_PROF',
        metrics: [
          {
            title: '% of Teachers Receiving an MMS Rating of Proficient',
            metricId: 'MMS_PROF'
          }
        ]
      },
      // {
      //   key: 'MMS_NEEDS_IMP',
      //   metrics: [
      //     {
      //       title: '% of Teachers Receiving an MMS Rating of Needs Improvement',
      //       metricId: 'MMS_NEEDS_IMP'
      //     }
      //   ]
      // },
      // {
      //   key: 'MMS_FAILING',
      //   metrics: [
      //     {
      //       title: '% of Teachers Receiving an MMS Rating of Failing',
      //       metricId: 'MMS_FAILING'
      //     }
      //   ]
      // },
      // {
      //   key: 'ESSA_EFF',
      //   metrics: [
      //     {
      //       title: '% of Teachers Receiving an ESSA Rating of Effective',
      //       metricId: 'ESSA_EFF'
      //     }
      //   ]
      // },
      // {
      //   key: 'ESSA_INEFF',
      //   metrics: [
      //     {
      //       title: '% of Teachers Receiving an ESSA Rating of Ineffective',
      //       metricId: 'ESSA_INEFF'
      //     }
      //   ]
      // },
      {
        key: 'TEACH_ATTENDANCE',
        metrics: [
          {
            title: '% of Teachers Attending 95% or More of Days',
            metricId: 'TEACH_ATTENDANCE'
          }
        ]
      },
      {
        key: 'SVY_STUD_TEACH',
        metrics: [
          {
            title:
              'Student Survey: Student Perception of Quality of Teacher Practice',
            subtitle: '(% of most positive responses)',
            metricId: 'SVY_STUD_TEACH'
          }
        ]
      }
    ]
  }
]

export default {
  components: {
    LineChart,
    ScrollSpyNav,
    QlikFilter
  },
  mixins: [SelectionsMixin],
  data() {
    return {
      sessionObject: null,
      schoolsInitialized: this.$store.state.schools.initialized,
      slugReport: this.$route.params.slug_report,
      metricValues: null,
      domainFacts,

      // school facts
      schoolReport: null,
      srcschoolid: null,
      schoolName: null,
      governance: null,
      address: null,
      phone: null,
      fax: null,
      zipCode: null,
      urlSchool: null,
      reportName: null,
      gradesServed: null,
      enrollment: null,
      admissionType: null,
      turnaround: null
    }
  },
  computed: {
    current() {
      return this
    },
    print() {
      return this.$route.query.print === 'true' ?? false
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

  beforeDestroy() {
    this.destroy()
  },

  methods: {
    countApplicableMetricsByGroup(metricGroup) {
      return metricGroup.metrics.filter(m =>
        this.isApplicableByMetricId(m.metricId)
      ).length
    },

    countApplicableMetricGroupsByDomain(domain) {
      return domain.metricGroups.filter(m => this.isApplicableByMetricGroup(m))
        .length
    },

    destroy() {
      if (this.sessionObject) {
        this.sessionObject.removeListener('changed', this.update)
        this.$qlik.destroySessionObject(this.sessionObject)
      }
    },

    getSPRColorByTextValue(textVal) {
      const val = parseInt(textVal)
      // console.log("this val for color", val)
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

    getFullReportTypeByShort(shortReportType) {
      if (shortReportType === 'K8') {
        return 'K-8'
      } else if (shortReportType === 'ES') {
        return 'Elementary School'
      } else if (shortReportType === 'MS') {
        return 'Middle School'
      } else if (shortReportType === 'HS') {
        return 'High School'
      } else {
        return shortReportType
      }
    },

    filterMetricGroupsByDomain(domain) {
      return domain.metricGroups.filter(metricGroup => {
        return (
          metricGroup.header ||
          (metricGroup.metrics && this.isApplicableByMetricGroup(metricGroup))
        )
      })
    },

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
      this.governance = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'governance' }
      )
      this.address = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'address' }
      )
      this.phone = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'phone' }
      )
      this.fax = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'fax' }
      )
      this.zipCode = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'zipCode' }
      )
      this.urlSchool = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'urlSchool' }
      )
      this.reportName = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'reportName' }
      )
      this.gradesServed = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'gradesServed' }
      )
      this.enrollment = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'enrollment' }
      )
      this.admissionType = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'admissionType' }
      )
      this.turnaround = await this.$store.dispatch(
        'schools/lookup_text_by_slugreport',
        { slugReport: this.slugReport, target: 'turnaround' }
      )

      const selectedValues = {}
      selectedValues.schoolReport = await this.$qlik.selectFieldValues(
        'School Name (Reporting Category)',
        [{ text: this.schoolReport }]
      )
      this.$store.dispatch('selections/set_current_selections', selectedValues)

      await this.update()
      if (this.print) {
        setTimeout(() => {
          console.log('print image')
          this.printPDF()
        }, 10000)
      }
    },

    isApplicableByMetricId(metricId) {
      if (this.metricValues) {
        const values = this.$qlik.lookupValueByFieldValue(
          this.metricValues,
          'metricId',
          metricId,
          'exception'
        )
        if (values && values.number) {
          return values.number !== 999
        } else {
          return true
        }
      } else {
        return null
      }
    },

    isApplicableByMetricGroup(metricGroup) {
      if (metricGroup.metrics) {
        const metricIds = metricGroup.metrics.map(v => v.metricId)
        let isApplicable = false
        metricIds.forEach(metricId => {
          const values = this.$qlik.lookupValueByFieldValue(
            this.metricValues,
            'metricId',
            metricId,
            'exception'
          )
          if (values && values.number) {
            if (values.number !== 999) {
              isApplicable = true
            }
          } else {
            isApplicable = true
          }
        })
        return isApplicable
      } else {
        return true
      }
    },

    lookupTextByFieldValue(
      sourceField,
      sourceFieldValue,
      targetField,
      valIfNullish
    ) {
      if (this.metricValues) {
        const values = this.$qlik.lookupValueByFieldValue(
          this.metricValues,
          sourceField,
          sourceFieldValue,
          targetField
        )
        if (values && values.text && values.text !== '-') {
          return values.text
        } else {
          return valIfNullish || ''
        }
      } else {
        return valIfNullish || ''
      }
    },

    lookupNumberByFieldValue(sourceField, sourceFieldValue, targetField) {
      if (this.metricValues) {
        const values = this.$qlik.lookupValueByFieldValue(
          this.metricValues,
          sourceField,
          sourceFieldValue,
          targetField
        )
        if (values && values.number) {
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
        this.metricValues = await this.$qlik.getValuesFromHypercubeObject(
          this.sessionObject
        )
      }
    },

    async handleSchoolReportSelection(selection) {
      console.log('handleSchoolReportSelection', selection, this.schoolReport)
      const slugReport = await this.$store.dispatch(
        'schools/lookup_slugreport_by_schoolreport',
        selection.selections[0].text
      )
      this.$router.push('/report/' + slugReport)
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
            'points_possible',
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
            'points_earned',
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
    }
  }
}
</script>
<style lang="postcss" scoped>
a {
  @apply underline text-blue-500;
}

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

.label-3year {
  font-size: 24pt;
  color: #888888;
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
