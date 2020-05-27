<template>
  <div>
    <Square class="flex flex-wrap mb-4" color="light" tight>
      <QlikKPI
        ref="kpi1"
        class="max-w-sm"
        :q-id="kpi1.props.qId"
        :title="kpi1.props.title"
        :subtitle="kpi1.props.subtitle"
        :secondary-label="kpi1.props.secondaryLabel"
        :description="kpi1.props.description"
      />
      <QdtComponent
        class="flex-auto m-2 p-2 bg-white"
        :type="chart1.type"
        :props="chart1.props"
      />
    </Square>
    <Square class="flex flex-wrap mb-4" color="light" tight>
      <QlikKPI
        class="max-w-sm"
        :q-id="kpi2.props.qId"
        :title="kpi2.props.title"
        :subtitle="kpi2.props.subtitle"
        :secondary-label="kpi2.props.secondaryLabel"
        :description="kpi2.props.description"
      />
      <QdtComponent
        class="flex-auto m-2 p-2 bg-white"
        :type="chart2.type"
        :props="chart2.props"
      />
    </Square>
    <Square
      v-if="!$store.getters['selections/oneSchoolSelected']"
      class="flex flex-wrap mb-4"
      color="light"
      tight
    >
      <QlikKPI
        class="max-w-sm"
        :q-id="kpi3.props.qId"
        :title="kpi3.props.title"
        :subtitle="kpi3.props.subtitle"
        :secondary-label="kpi3.props.secondaryLabel"
        :description="kpi3.props.description"
      />
      <QdtComponent
        class="flex-auto m-2 p-2 bg-white"
        :type="chart3.type"
        :props="chart3.props"
      />
    </Square>
    <Square
      v-if="!$store.getters['selections/oneSchoolSelected']"
      class="flex flex-wrap mb-4"
      color="light"
      tight
    >
      <QlikKPI
        class="max-w-sm"
        :q-id="kpi4.props.qId"
        :title="kpi4.props.title"
        :subtitle="kpi4.props.subtitle"
        :secondary-label="kpi4.props.secondaryLabel"
        :description="kpi4.props.description"
      />
      <QdtComponent
        class="flex-auto m-2 p-2 bg-white"
        :type="chart4.type"
        :props="chart4.props"
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
  data() {
    return {
      kpi1: {
        type: 'kpi',
        props: {
          qId: 'bJYMhp',
          description:
            'Averaged for all applicable district and charter schools',
          title: '',
          subtitle: ' ',
          secondaryLabel: 'From  ' + this.$store.state.SY_P,
          color: 'light'
        }
      },
      kpi2: {
        type: 'kpi',
        props: {
          qId: 'ghWAbL',
          description:
            'Average of previous three reports, averaged for all applicable district and charter schools',
          title: '',
          subtitle: ' ',
          secondaryLabel: 'From  ' + this.$store.state.SY_P,
          color: 'light'
        }
      },
      kpi3: {
        type: 'kpi',
        props: {
          qId: 'hGwBh',
          description:
            'Averaged for all applicable district and charter schools',
          title: '',
          subtitle: ' ',
          secondaryLabel: 'From  ' + this.$store.state.SY_P,
          color: 'light'
        }
      },
      kpi4: {
        type: 'kpi',
        props: {
          qId: 'kcmZvgT',
          description:
            'Averaged for students at all applicable district and charter schools',
          title: '',
          subtitle: ' ',
          secondaryLabel: 'From  ' + this.$store.state.SY_P,
          color: 'light'
        }
      },
      chart1: {
        type: 'QdtViz',
        props: { id: 'uShJQ', type: 'comboLineBarchart', height: '300px' }
      },
      chart2: {
        type: 'QdtViz',
        props: { id: 'xvbQB', type: 'lineChart', height: '300px' }
      },
      chart3: {
        type: 'QdtViz',
        props: { id: 'cQeEbS', type: 'comboLineBarchart', height: '300px' }
      },
      chart4: {
        type: 'QdtViz',
        props: { id: 'Meftc', type: 'comboLineBarchart', height: '300px' }
      }
    }
  }
}
</script>

<style>
.bold {
  font-weight: bold;
}
</style>
