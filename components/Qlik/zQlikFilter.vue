<template>
  <div
    class="form-multiselect block w-full bg-transparent border-none text-blue-900 overflow-y-hidden"
    ref="parent">    
    <div ref="title" class="mb-1 inline-flex justify-between w-full">
      <h1 v-if="title" class="text-left font-semibold"> {{ title }} </h1>
      <button v-if="anySelections" 
        class="btn-secondary h-6"
        @click="clearSelections">
        Clear
      </button>
    </div>
    <div ref="search" 
      v-if="values.length > 5"
      class="inline-flex justify-between w-full mb-4 bg-white appearance-none border border-blue-900  py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
      <div class="inline-flex">
        <SVGSearch />
        <input 
          class="pl-2 text-blue-900 "
          id="search-filter" 
          type="text" 
          placeholder=""
          v-model="searchText" />
      </div>
      <SVGClear v-if="searchText.length > 0"
        class="flex-initial"
        @click="searchText = ''" />
    </div>

    <!-- if type=="list" create a scrollable list -->
    <div class="overflow-y-auto"
      style="scrollbar-color: #090;"
      ref="scrollwindow" >
      <div v-for="(value, index) in values" :key="index">
        <QlikFilterItem
          v-if="value.isSelected || 
            value.text.toLowerCase().includes(searchText.toLowerCase())"
          :text="value.text"
          :number="value.number"
          :is-selected="value.isSelected"
          :is-excluded="value.isExcluded"
          @click="handleItemClick" />
      </div>
    </div>
  </div>
</template>

<script>
import { layoutToFieldMap, updateValues, getQDef } from './qDefUtilities.js'
import QlikFilterItem from './QlikFilterItem.vue'
import SVGSearch from '~components/SVG/SVGSearch.vue'
import SVGClear from '~components/SVG/SVGClear'

export default {
  components: {
    QlikFilterItem,
    SVGSearch,
    SVGClear,
  },
  props: {
    field: {
      type: String,
      required: true,
    },
    preventMultipleSelections: {
      type: Boolean,
      required: false,
      default: false,
    },
    preventNoSelections: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false
    },
    expression: {
      type: String,
      required: false,
      default: ''
    },
    maxValues: {
      type: Number,
      required: false,
      default: 500,
    },
    
  },
  data: function() {
    return {
      // isNumeric: false,
      sessionObject: null,
      searchText: '',
      longListSize: 5, // determines whether we have a search and float selected to the top
      values: [],
      anySelections: false
    }
  },
  watch: {
    field() {
      this.initialize()
    },
    expression() {
      this.initialize()
    }
  },
  methods: {
    async clearSelections() {
      const engine = await this.$store.state.qdtComponents.qDocPromise   
      const field = await engine.getField(this.field)
      field.clear()
    },
    /**
     * When a user selects an item the effect is determined by the preventMultipleSelections and preventNoSelections props. 
     * If clicking on a possible (not selected) value, if preventMultipleSelections is false then add this to set of current selections, if false replace with this value
     * If cliciking on a currently selected value, if preventNoSelections is false then remove this item from the list, else do nothing 
     * If false, then remove this item from the list of selected items.
     * This function does not impact the view, rather, a change listener waits for Qlik engine to report changes.
     */
    async handleItemClick ({ text, number }) {
      try {
        // this is a toggle, so remove a clicked value if it is already selected
        // but don't affect the state, let update do that, checking the actual qlik field selections
        let selectedValues = this.values.filter(val => val.isSelected ? val.isSelected : false )
        // console.log("value selected", text, number, selectedValues)        

        let index = selectedValues.map(val => val.text).indexOf(text)
        if (index >= 0) {
          if (selectedValues.length > 1 || !this.preventNoSelections) {
            selectedValues.splice(index, 1)
          }
        } else {
          if (!this.preventMultipleSelections) {
            selectedValues.push({ text, number })
          } else {
            selectedValues = [{ text, number }]
          }
        }
        const qValues = selectedValues.map(val => {
          let obj = {qIsNumeric: val.number != null ? true: false}
          if (val.number != null) {
            obj['qNumber'] = val.number
          } else {
            obj['qText'] = val.text
          }
          return obj
        })

        const engine = await this.$store.state.qdtComponents.qDocPromise        
        const field = await engine.getField(this.field)
        await field.selectValues(qValues)

        // if we are not at the top of the page when a user selects something
        // animate a fast scroll to the top
        if (this.$refs.scrollwindow && this.$refs.scrollwindow.scrollTop) {    
          const scrollChange = this.$refs["scrollwindow"].scrollTop / 4      
          const animateScroll = () => {            
            let scrollTop = this.$refs["scrollwindow"].scrollTop
            if (scrollTop < scrollChange) {
              this.$refs["scrollwindow"].scrollTop = 0
            } else {
              this.$refs["scrollwindow"].scrollTop = scrollTop - scrollChange
              setTimeout(animateScroll, 66)
            }
          }
          setTimeout(animateScroll, 66)
        }
        
      } catch (error) {
        console.log("error in handleSelection of QlikFilter", error)
      }
    },

    async initialize () {
      try {
        // has this already been set up, if so remove old listener
        if (this.sessionObject) {
          await this.removeQlikListeners()
          this.values = []
        }
        // create a session object that will respond to user selections, will use the update methods to get changes
        const engine = await this.$store.state.qdtComponents.qDocPromise
        const dynamicQDef = getQDef([this.field], false, this.expression, this.maxValues) 
        this.sessionObject = await engine.createSessionObject(dynamicQDef)           
        this.sessionObject.on("changed", this.update)

        // create a temporary session objet that will not respond to user selections, intended to get all values
        const staticQDef = getQDef([this.field], true, this.expression, this.maxValues) 
        const staticSessionObject = await engine.createSessionObject(staticQDef)      
        const layout = await staticSessionObject.getLayout()        
        this.values = layoutToFieldMap(layout, true)[this.field]        
        await engine.destroySessionObject(staticSessionObject.id)

        this.update()
      } catch (err) {
        console.log("error in QlikFilter", err)
      }
    },

    async removeQlikListeners () {
      if (this.$store.state.qdtComponents && this.sessionObject) {
        const engine = await this.$store.state.qdtComponents.qDocPromise        
        await this.sessionObject.removeListener("changed", this.update)
        await engine.destroySessionObject(this.sessionObject.id)
        this.sessionObject = null   
        return true   
      } else {
        return false
      }
    },

    async update () {      
      // The private function is used because we need to use the OnData callback of selectionState
      // waiting for the promise to fulfil doesn't appear to work
      const _handleOnData = async () => {
        selectionState.OnData.unbind(_update)
        _update()
      }

      const _update = async () => {        
        let selectedTextValues = []
        try {
          if (selectionState.selections.length > 0) {
            const selectedFields = selectionState.selections.filter(selection => selection.fieldName == this.field)
            if (selectedFields.length > 0) {
              selectedTextValues = selectedFields[0].selectedValues.map(obj => obj.qName)     
              this.anySelections = true
            } else {
              this.anySelections = false
            }
          } else {
            this.anySelections = false
          }
        } catch (err) {
          console.log("error getting selected values", err)
        }

        let possibleTextValues = []
        try {          
          const layout = await this.sessionObject.getLayout()
          possibleTextValues = layoutToFieldMap(layout, false)[this.field]
        } catch (err) {
          console.log("error getting dynamic session layout", err)
        }

        // if there are no updates values will return null
        const values = updateValues(this.values, possibleTextValues, selectedTextValues, this.values.length >= this.longListSize)        
        if (values) {
          this.values = values
          let currentSelections = {}
          currentSelections[this.field] = selectedTextValues
          await this.$store.dispatch("update_current_selections", currentSelections)
          this.$emit('changed', this.values)
        }
      }
      const app = await this.$store.state.qdtComponents.qAppPromise
      const selectionState = await app.selectionState()
      // check to see if we already have selections, if so we update directly, else wait for OnData to get called
      if (selectionState.selections.length) {
        _update()
      } else {
        selectionState.OnData.bind(_handleOnData)
      }      
    },
  },

  /**
   * Mounted will initialize the values of the filter. Once updated the height of the scrollwindow will be set
   */
  async mounted() {    
    await this.initialize()
    // set the scrollwindow's height to that of the parent - title stuff, this will force the scroll just to the scroll area
    if (this.$refs.scrollwindow) {
      const scrollHeight = this.$refs.parent.clientHeight - (
        (this.$refs.title ? this.$refs.title.clientHeight + 15 : 0) + 
        (this.$refs.search ? this.$refs.search.clientHeight + 15 : 0)
      ) 
      this.$refs.scrollwindow.style.height = scrollHeight + "px"
      // console.log("mounted", scrollHeight, this.$refs)
    }
  },

  async destroyed() {
    this.removeQlikListeners()
  },
}
</script>

    
<style scoped>

/* width */
::-webkit-scrollbar {
  width: 10px;
}
/* Track */
::-webkit-scrollbar-track {
  @apply bg-blue-200;
}
/* Handle */
::-webkit-scrollbar-thumb {
  @apply bg-blue-300;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  @apply bg-blue-500;
}
</style>