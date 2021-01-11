<template>
  <div>
    <Square class="w-full flex flex-wrap mb-4" color="light" tight>
      <QlikKPI
        ref="kpi1"
        class="max-w-sm"
        :q-id="kpi1.qId"
        :title="kpi1.title"
        :subtitle="kpi1.subtitle"
        :secondary-label="kpi1.secondaryLabel"
        :description="kpi1.description"
      />
      <QdtComponent
        class="flex-auto m-2 p-2 bg-white"
        type="QdtViz"
        :props="chart1"
      />
    </Square>
    <Square class="w-full flex flex-wrap mb-4" color="light" tight>
      <QlikKPI
        class="max-w-sm"
        :q-id="kpi2.qId"
        :title="kpi2.title"
        :subtitle="kpi2.subtitle"
        :secondary-label="kpi2.secondaryLabel"
        :description="kpi2.description"
      />
      <QdtComponent
        class="flex-auto m-2 p-2 bg-white"
        type="QdtViz"
        :props="chart2"
      />
    </Square>
    <Square
      v-if="!$store.getters['selections/oneSchoolSelected']"
      class="w-full flex flex-wrap mb-4"
      color="light"
      tight
    >
      <QlikKPI
        class="max-w-sm"
        :q-id="kpi3.qId"
        :title="kpi3.title"
        :subtitle="kpi3.subtitle"
        :secondary-label="kpi3.secondaryLabel"
        :description="kpi3.description"
      />
      <QdtComponent
        class="flex-auto m-2 p-2 bg-white"
        type="QdtViz"
        :props="chart3"
      />
    </Square>
    <Square
      v-if="!$store.getters['selections/oneSchoolSelected']"
      class="w-full flex flex-wrap mb-4"
      color="light"
      tight
    >
      <QlikKPI
        class="max-w-sm"
        :q-id="kpi4.qId"
        :title="kpi4.title"
        :subtitle="kpi4.subtitle"
        :secondary-label="kpi4.secondaryLabel"
        :description="kpi4.description"
      />
      <QdtComponent
        class="flex-auto m-2 p-2 bg-white"
        type="QdtViz"
        :props="chart4"
      />
    </Square>
  </div>
</template>

<script>
import QdtComponent from '~sdp-components/Qdt/QdtComponent'
import QlikKPI from '~sdp-components/Qlik/QlikKPI'
import Square from '~sdp-components/PageElements/Square'

export default {
  layout: 'main',
  components: {
    QdtComponent,
    QlikKPI,
    Square
  },
  computed: {
    kpi1() {
      return {
        qId: 'bJYMhp',
        description: 'Averaged for all applicable district and charter schools',
        title: '',
        subtitle: ' ',
        secondaryLabel: `From ${this.$store.getters.sy_p}`,
        color: 'light'
      }
    },
    kpi2() {
      return {
        qId: 'ghWAbL',
        description:
          'Average of previous three reporting years, averaged for all applicable district and charter schools',
        title: '',
        subtitle: ' ',
        secondaryLabel: `From ${this.$store.getters.sy_p}`,
        color: 'light'
      }
    },
    kpi3() {
      return {
        qId: 'hGwBh',
        description: 'Averaged for all applicable district and charter schools',
        title: '',
        subtitle: ' ',
        secondaryLabel: `From ${this.$store.getters.sy_p}`,
        color: 'light'
      }
    },
    kpi4() {
      return {
        qId: 'kcmZvgT',
        description:
          'Averaged for students at all applicable district and charter schools',
        title: '',
        subtitle: ' ',
        secondaryLabel: `From ${this.$store.getters.sy_p}`,
        color: 'light'
      }
    },
    chart1() {
      return { id: 'uShJQ', type: 'comboChart', height: '300px' }
    },
    chart2() {
      return { id: 'xvbQB', type: 'lineChart', height: '300px' }
    },
    chart3() {
      return { id: 'cQeEbS', type: 'comboChart', height: '300px' }
    },
    chart4() {
      return { id: 'Meftc', type: 'comboChart', height: '300px' }
    }
  }
}
</script>

<style>
.bold {
  font-weight: bold;
}
</style>
