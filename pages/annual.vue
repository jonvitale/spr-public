<template>
  <div>
    <ScrollSpyNav
      class="sticky top-0 bg-white"
      title="Charts:"
      :refs="['v-distribution', 'v-map', 'v-table', 'v-points']"
      orientation="row"
    />
    <div class="flex flex-wrap">
      <Square
        ref="v-distribution"
        name="Distribution"
        class="w-full flex flex-wrap mb-4"
        color="light"
        tight
      >
        <div class="flex flex-col justify-between">
          <QlikKPI
            ref="kpi1"
            class="max-w-sm"
            :q-id="kpi1.qId"
            :subtitle="kpi1.subtitle"
            :secondary-label="kpi1.secondaryLabel"
            :description="kpi1.description"
          />
          <div class="w-full mb-2 flex flex-row justify-center">
            <ButtonGroup
              :options="{
                current: 'Current Year',
                '3year': '3-Year Average'
              }"
              @buttonClicked="handleYearSelection($event.value, $event.label)"
            />
          </div>
        </div>
        <QdtComponent
          v-if="currentSchoolReport"
          type="QdtViz"
          :props="distribution_alt"
          class="flex-auto m-2 p-2 bg-white"
        />
        <QdtComponent
          v-else
          type="QdtViz"
          :props="distribution"
          class="flex-auto m-2 p-2 bg-white"
        />
      </Square>
      <Square ref="v-map" name="Map" class="w-full mb-4 " color="dark">
        <Heading size="medium">
          Map {{ metricTypeMap[metricType] }} by School and
          {{ backgroundAreaTypeMap[areaType] }}
        </Heading>
        <Square color="tint" class="mt-2">
          <div class="w-full flex flex-row justify-center">
            <ButtonGroup
              :options="metricTypeMap"
              :selected-value="metricType"
              label="Metric"
              @buttonClicked="handleMetricSelection($event.value, $event.label)"
            />
          </div>
          <div class="w-full flex flex-row justify-center">
            <ButtonGroup
              :options="backgroundAreaTypeMap"
              :selected-value="areaType"
              label="Background area"
              @buttonClicked="
                handleBackgroundSelection($event.value, $event.label)
              "
            />
          </div>
        </Square>
        <QdtComponent class="w-full" type="QdtViz" :props="map" />
      </Square>
      <Square ref="v-table" name="Table" class="w-full mb-4" color="tint" tight>
        <QdtComponent class="w-full" type="QdtViz" :props="table" />
      </Square>
      <Square
        ref="v-points"
        name="Points"
        class="w-full mb-4"
        color="transparent"
        tight
      >
        <QdtComponent
          v-if="selectedLevel === 'domain'"
          class="w-full"
          type="QdtViz"
          :props="points_domain"
        >
          <span class="text-left">
            Note: only one report type is show. You can select a different
            report type with the Filters panel.
          </span>
        </QdtComponent>
        <QdtComponent
          v-else
          class="w-full"
          type="QdtViz"
          :props="points_metric"
        >
          <span class="text-left">
            Note: only one report type is show. You can select a different
            report type with the Filters panel.
          </span>
        </QdtComponent>
        <div v-if="!currentDomain" class="w-full flex flex-row justify-center">
          <ButtonGroup
            :options="{
              domain: 'Domain',
              metric: 'All Metrics'
            }"
            @buttonClicked="handleLevelSelection($event.value, $event.label)"
          />
        </div>
      </Square>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import QdtComponent from '~sdp-components/Qdt/QdtComponent'
import QlikKPI from '~sdp-components/Qlik/QlikKPI'
import Square from '~sdp-components/PageElements/Square'
import Heading from '~sdp-components/PageElements/Heading'
import ButtonGroup from '~sdp-components/PageElements/ButtonGroup'
import ScrollSpyNav from '~sdp-components/Navigation/ScrollSpyNav'

export default {
  layout: 'main',
  components: {
    QdtComponent,
    QlikKPI,
    Square,
    Heading,
    ButtonGroup,
    ScrollSpyNav
  },
  data() {
    return {
      selectedDomain: '',
      selectedLevel: 'domain',
      areaType: 'ZipCode',
      metricType: 'PercScore_Current'
    }
  },
  computed: {
    metricTypeMap() {
      return {
        PercScore_Current: `% Earned (${this.$store.getters.sy_c})`,
        PercScore_3Year_Current: '3-Year Avg % Earned',
        PercScore_YOY: `Change from ${this.$store.getters.sy_p} to ${this.$store.getters.sy_c}`
      }
    },
    backgroundAreaTypeMap() {
      return {
        ZipCode: 'Zip Code',
        HS: 'High School Area',
        MS: 'Middle School Area',
        ES: 'Elementary School Area'
      }
    },

    ...mapState({
      currentDomain: state => state.selections.domain,
      currentSchoolReport: state => state.selections.schoolReport
    }),
    // Qlik Objects
    kpi1() {
      return {
        qId: 'XTmmsjm',
        title: '',
        subtitle: ' ',
        secondaryLabel: `From ${this.$store.getters.sy_p}`,
        description: 'Averaged for all applicable district and charter schools'
      }
    },
    map() {
      return {
        id: 'jKmNJ',
        type: 'map',
        height: '600px'
      }
    },
    distribution() {
      return {
        id: 'c0911370-79b9-49e4-8397-2a4a18c929af',
        type: 'extension',
        height: '400px'
      }
    },
    distribution_alt() {
      return { id: 'bqEGkTd', type: 'comboChart', height: '300px' }
    },
    table() {
      return {
        id: 'BSXpST',
        type: 'table',
        height: '600px'
      }
    },
    points_domain() {
      return {
        id: 'YxJUPz',
        type: 'barplot',
        height: this.selectedDomain ? '600px' : '400px'
      }
    },
    points_metric() {
      return {
        id: 'MqPVL',
        type: 'barplot',
        height: '600px'
      }
    }
  },

  /**
   * Remove field values that we don't want to carry to other pages
   */
  async destroyed() {
    const fieldsToClear = ['Metric_Name_Possible', 'Domain_Name_Possible']
    const engine = await this.$qlik.engine
    let field
    fieldsToClear.forEach(async fieldName => {
      field = await engine.getField(fieldName)
      await field.clear()
    })
  },
  methods: {
    handleLevelSelection(value, label) {
      this.selectedLevel = value
    },

    handleYearSelection(yearId, yearName) {
      // console.log('handleYearSelection', yearId, yearName)
      if (yearId === 'current') {
        this.$qlik.setVariableValueByName(
          'vSelectedMeasure_YOY',
          'PercScore_Current'
        )
        this.$set(
          this.kpi1,
          'title',
          'Average % Earned - ' +
            (this.selectedDomain ? this.selectedDomain : 'Overall')
        )
        this.$set(
          this.kpi1,
          'description',
          'Averaged for all applicable district and charter schools'
        )
        this.$set(this.kpi1, 'qId', 'XTmmsjm')
      } else if (yearId === '3year') {
        this.$qlik.setVariableValueByName(
          'vSelectedMeasure_YOY',
          'PercScore_3Year_Current'
        )
        this.$set(
          this.kpi1,
          'title',
          '3-Year Average % Earned - ' +
            (this.selectedDomain ? this.selectedDomain : 'Overall')
        )
        this.$set(
          this.kpi1,
          'description',
          'Average of previous three reporting years, averaged for all applicable district and charter schools'
        )
        this.$set(this.kpi1, 'qId', 'ghWAbL')
      }
      this.$forceUpdate()
    },

    handleBackgroundSelection(areaType, areaLabel) {
      this.$qlik.setVariableValueByName('vSelector_MapBackground_SPR', areaType)
      this.areaType = areaType
    },

    handleMetricSelection(metricType, metricLabel) {
      this.$qlik.setVariableValueByName('vSelectedMeasure', metricType)
      this.metricType = metricType
    }
  }
}
</script>
