// import Vue from 'vue';

export const state = () => ({
  initialized: false,
  list: [],
})

export const getters = {
  list: state => {
    return state.list
  },
  
}

export const mutations = {
  initialized(state, val) {
    console.log("school initialized", this)
    state.initialized = val
  },
  add(state, data) {
    state.list.push(data)
  },
  replace(state, data) {
    state.list = data
  },
  empty(state) {
    state.list = []
  }
}

export const actions = {
  async set_schools({ commit }, values) {
    console.log("set_schools", values)
    commit('replace', values)
    commit('initialized', true)    
  },

  lookup_slugreport_by_schoolreport ({ state }, schoolReport) {
    // console.log("lookup_slugreport_by_schoolreport ", schoolReport, state.list)
    const slugReport = this.$qlik.lookupValueByFieldValue(state.list, "schoolReport", schoolReport, "slugReport")
    if (slugReport) {
      return slugReport.text
    } else {
      return ''
    }
  },

  lookup_text_by_slugreport ({ state }, { slugReport, target }) {
    // console.log("lookup_text_by_slugreport",  slugReport, target, state.list)
    const value = this.$qlik.lookupValueByFieldValue(state.list, "slugReport", slugReport, target)
    if (value) {
      return value.text
    } else {
      return ''
    }
  },
}
