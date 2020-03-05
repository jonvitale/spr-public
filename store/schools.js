import Vue from 'vue';

export const state = () => ({
  initialized: false,
  list: [],
})

export const getters = {
  list: state => {
    return state.list
  },
  filteredByField: state => (searchField, searchTerm) => {
    return state.list.filter(m => m[searchField].indexOf(searchTerm))
  },

  lookupSlugReportBySchoolReport: state => school_report => {
    const slug_report = Vue.prototype.$qlik.lookupValueByFieldValue(state.list, "school_report", school_report, "slug_report")
    if (slug_report) {
      return slug_report.text
    } else {
      return ''
    }
  },

  lookupTextBySlugReport: state => (slug_report, targetField) => {
    const value = Vue.prototype.$qlik.lookupValueByFieldValue(state.list, "slug_report", slug_report, targetField)
    if (value) {
      return value.text
    } else {
      return ''
    }
  },
}

export const mutations = {
  initialized(state, val) {
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
  }
}
