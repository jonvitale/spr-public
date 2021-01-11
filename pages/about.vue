<template>
  <div>
    <ScrollSpyNav
      class="sticky top-0 bg-white"
      title="Sections:"
      :refs="['v-summary', 'v-metrics', 'v-research']"
      orientation="row"
    />
    <div class="mx-8">
      <div ref="v-summary" name="Summary" color="tint">
        <h1>Summary</h1>
        <p>
          The School Progress Reports website provides visualization of the
          city-wide scores on the School Progress Report (SPR) at the overall,
          domain and metric level. The SPR is the District’s annual school
          accountability framework. It provides information about how schools
          are doing in the areas that matter the most for student success-
          Academic Achievement and Progress, School Climate and Safety, and
          College and Career Readiness. District and school leaders use SPR data
          to identify which schools are strong in which areas, where are
          children achieving at high levels, and what areas each school must
          change in order to improve outcomes for students.
        </p>
        <ul>
          <li>
            <span class="font-semibold">Data Refresh:</span> Annually,
            January/February
          </li>
          <li>
            <span class="font-semibold">Data Attribution:</span> Attribution
            rules differ by metric. All attribution rules are available on the
            SPR Helpful Resources web-page in the SPR User Guide and SPR
            Business Rules. See the
            <a
              href="https://www.philasd.org/performance/programsservices/school-progress-reports/"
              target="_blank"
            >
              District Peformance Office, School Progress Reports
            </a>
            website details.
          </li>
          <li>
            <span class="font-semibold">School Sectors Included:</span> District
            and Charter (not including virtual charters)
          </li>
          <li>
            <span class="font-semibold">School Years Included:</span> SY 2012-13
            to SY {{ $store.getters.sy_c }}
          </li>
        </ul>
        <div class="section-break" />
      </div>
      <div ref="v-metrics" name="Metrics">
        <h1>Metrics</h1>
        <h2>Overall Score</h2>
        <p>
          The aggregated percentage of points earned out of the points possible
          across all metrics on the SPR for which a school is eligible on the
          SPR. The percentage of points earned determines the school report’s
          Overall Performance Tier (Intervene, Reinforce, Watch, and Model):
        </p>
        <ul>
          <li>
            <span class="text-white bg-spr-intervene px-1">
              Intervene: 0 - 24% (red)
            </span>
          </li>
          <li>
            <span class="text-white bg-spr-watch px-1">
              Watch: 25-49% (orange)
            </span>
          </li>
          <li>
            <span class="text-white bg-spr-reinforce px-1">
              Reinforce: 50-74% (green)
            </span>
          </li>
          <li>
            <span class="text-white bg-spr-model px-1">
              Model: 75-100% (blue)
            </span>
          </li>
        </ul>
        <h2>Domain Score</h2>
        <p>
          The aggregated percentage of points earned out of the points possible
          across all metrics for which a school is eligible within each of the
          four domains (Achievement, Progress, Climate, and College and Career).
          The maximum points possible varies by domain and school report type
          (Elementary, K8, Middle School, and High School):
        </p>
        <ul>
          <li>Achievement: 30 for all report types</li>
          <li>Progress: 40 for all report types</li>
          <li>
            Climate: 30 for non-high school reports, 20 for high school reports
          </li>
          <li>College and Career: 10 for high school reports only</li>
        </ul>
        <h2>Metric Score</h2>
        <p>
          The actual value that a school received for a given metric. For
          example, the actual percent of students who attended 95% or more of
          instructional days.
        </p>
        <div class="section-break" />
      </div>
      <div ref="v-research" name="Research and Reports" color="tint">
        <h1>SDP Research and Reports</h1>
        <div v-for="(prod, index) in researchProduct" :key="index">
          <div v-if="researchRelevance[index].text === '1'" class="research">
            <div class="research--product">
              <a :href="researchLink[index].text" target="_blank">
                {{ researchProduct[index].text || '' }}
              </a>
            </div>
            <div class="research--type-date">
              {{ researchType[index].text || '' }},
              {{ researchDate[index].text || '' }}
            </div>
            <div class="research--authors">
              {{ researchAuthors[index].text || '' }}
            </div>
            <div class="research--abstract">
              {{ researchAbstract[index].text || '' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import ScrollSpyNav from '~sdp-components/Navigation/ScrollSpyNav'

export default {
  layout: 'default',
  components: {
    ScrollSpyNav
  },
  computed: {
    ...mapState({
      researchAbstract: state => state.research.values.abstract,
      researchAuthors: state => state.research.values.authors,
      researchDate: state => state.research.values.date,
      researchLink: state => state.research.values.link,
      researchProduct: state => state.research.values.product,
      researchRelevance: state => state.research.values.relevance,
      researchType: state => state.research.values.type
    })
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

p,
ul {
  font-size: 13pt;
  padding-bottom: 1rem;
  list-style-type: circle;
}
li {
  margin-left: 4rem;
}

.section-break {
  padding-bottom: 3rem;
}

.research {
  padding-bottom: 1rem;
}

.research--product {
  font-size: 18pt;
  @apply text-blue-600 underline;
}

.research--authors,
.research--type-date {
  font-size: 15pt;
}

.research--abstract {
  font-size: 13pt;
}

.research--authors {
  font-style: italic;
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
