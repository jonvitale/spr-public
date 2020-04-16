export const state = () => ({
  YearEnd_C: 2019,
  YearEnd_P: 2018,
  SY_C: "2018-19",
  SY_P: "2017-18",
  SY_PP: "2016-17",
  schoolReport_fields: ["schoolReport", "School Name (Reporting Category)"],
  schoolReport: "", // if one-and-only one reportName is selected
  slugReport: "",
  current_selections: {},
  qdtComponents: null,
})

export const mutations = {
  setQdtComponents (state, qdtComponents) {
    state.qdtComponents = qdtComponents
  },
  set_only_schoolReport(state, schoolReport) {
    state.schoolReport = schoolReport
  },
  set_only_slugReport(state, slugReport) {
    state.slugReport = slugReport
  },
  set_current_selections_in_field(state, {field, selections}) {
    state.current_selections[field] = selections
  }
}

export const actions = {
  // async initialize({ state, dispatch }) {
  //   await dispatch("schools/set_schools", state.qdtComponents)
  // },
  async set_only_schoolReport({ commit, dispatch }, schoolReport) {
    commit("set_only_schoolReport", schoolReport)
    if (schoolReport) {
      const slugReport = await dispatch("schools/lookup_slugreport_by_schoolreport", schoolReport)
      commit("set_only_slugReport", slugReport)
    } else {
      commit("set_only_slugReport", "")
    }
  },
  async update_current_selections({state, commit, dispatch} , selectionsByField) {
    // for each field in the selections update the stored object
    let field, selections
    for (field in selectionsByField) {
      selections = selectionsByField[field]
      commit("set_current_selections_in_field", { field, selections})
      // for the special case where this is the "schoolReport" and a single item is selected set the value in the state       
      if (state.schoolReport_fields.includes(field)) {
        if (selections.length === 1) {
          await dispatch("set_only_schoolReport", selections[0].text)
        } else {
          await dispatch("set_only_schoolReport", "")
        }
      }
    }
  }
}