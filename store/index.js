export const state = () => ({
  YearEnd_C: 2018,
  YearEnd_P: 2017,
  SY_C: "2017-18",
  SY_P: "2016-17",
  SY_PP: "2015-16",
  school_report_fields: ["school_report", "School Name (Reporting Category)"],
  school_report: "", // if one-and-only one report_name is selected
  slug_report: "",
  current_selections: {},
  qdtComponents: null,
})

export const mutations = {
  setQdtComponents (state, qdtComponents) {
    state.qdtComponents = qdtComponents
  },
  set_only_school_report(state, school_report) {
    state.school_report = school_report
  },
  set_only_slug_report(state, slug_report) {
    state.slug_report = slug_report
  },
  set_current_selections_in_field(state, {field, selections}) {
    state.current_selections[field] = selections
  }
}

export const actions = {
  // async initialize({ state, dispatch }) {
  //   await dispatch("schools/set_schools", state.qdtComponents)
  // },
  async set_only_school_report({ commit, rootGetters }, school_report) {
    commit("set_only_school_report", school_report)
    if (school_report) {
      const slug_report = rootGetters["schools/lookupSlugReportBySchoolReport"](school_report)
      commit("set_only_slug_report", slug_report)
    } else {
      commit("set_only_slug_report", "")
    }
  },
  async update_current_selections({state, commit, dispatch} , selectionsByField) {
    // for each field in the selections update the stored object
    let field, selections
    for (field in selectionsByField) {
      selections = selectionsByField[field]
      commit("set_current_selections_in_field", { field, selections})
      // for the special case where this is the "school_report" and a single item is selected set the value in the state       
      if (state.school_report_fields.includes(field)) {
        if (selections.length === 1) {
          await dispatch("set_only_school_report", selections[0].text)
        } else {
          await dispatch("set_only_school_report", "")
        }
      }
    }
  }
}