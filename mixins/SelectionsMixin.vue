<script>
export default {
  methods: {
    handleFieldSelections ({ field, selections }) {
      try {
        this.$store.dispatch("selections/set_current_selections_in_field", { field, selections })
      } catch (error) {
        console.log("error dispatching 'set_current_selections_in_field' from vuex index")
      }
    },

    /**
     * selectionsByField { field1: [value1, value2, ...], field2: [value1, value2, ...], ..}
     */
    handleSelections (selectionsByField) {
      try {
        this.$store.dispatch("selections/set_current_selections", selectionsByField)
      } catch (error) {
        console.log("error dispatching 'set_current_selections' from vuex index")
      }
    }
  }
}
</script>