<template>
  <nav>
    <ul class="flex flex-wrap md:flex-no-wrap justify-between mb-4 text-sm">
      <NavigationItem label="Overview" link="/overview" />
      <NavigationItem label="Map" link="/map" />
      <NavigationItem label="Tiers" link="/tiers" />
      <NavigationItem label="School Report" :link="school_report_route" />
      <NavigationItem label="Calculator" :link="school_calculator_route" />
    </ul>
  </nav>
</template>

<script>
import NavigationItem from '~components/Navigation/NavigationItem.vue'

export default {
  components: {
    NavigationItem
  },
  computed: {
    school_report_route() {
      const slug_report = this.$store.state["slug_report"]
      if (slug_report.length) {
        return '/report/' + slug_report
      } else {
        return '/report'
      }
    },
    school_calculator_route() {
      const slug_report = this.$store.state["slug_report"]
      if (slug_report.length) {
        return '/calculator/' + slug_report
      } else {
        return '/calculator'
      }
    }
  },
}
</script>
