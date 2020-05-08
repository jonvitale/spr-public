<script>
export default {
  methods: {
    handleFieldSelections ({ field, selections }) {
      try {
        this.$store.dispatch("selections/set_current_selections_field", { field, selections })
      } catch (error) {
        console.log("error dispatching 'set_current_selections_field' from vuex index")
      }
    },
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