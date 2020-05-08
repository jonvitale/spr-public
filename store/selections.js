export const state = () => ({
  schoolReport_fields: ["schoolReport", "School Name (Reporting Category)"],
  schoolReport: "", // if one-and-only one reportName is selected
  slugReport: "",
  domain_fields: ["Domain_Name"],
  domain: "",
  current_selections: {},
})


export const getters = {
  oneSchoolSelected (state) {
    return state.slugReport.length >= 1
  },
  oneDomainSelected (state) {
    return state.domain.length >= 1
  }
}

export const mutations = {
  set_only_schoolReport (state, schoolReport) {
    state.schoolReport = schoolReport
  },
  set_only_slugReport (state, slugReport) {
    state.slugReport = slugReport
  },
  set_only_domain (state, domain) {
    state.domain = domain
  },
  set_current_selections_in_field (state, {field, selections}) {
    state.current_selections[field] = selections
  }
}

export const actions = {
  async set_only_schoolReport ({ commit, dispatch }, schoolReport) {
    commit("set_only_schoolReport", schoolReport)
    if (schoolReport) {
      const slugReport = await dispatch("schools/lookup_slugreport_by_schoolreport", schoolReport, { root : true})
      commit("set_only_slugReport", slugReport)
    } else {
      commit("set_only_slugReport", "")
    }
  },

  async set_only_domain ({ commit }, domain ) {
    commit ("set_only_domain", domain)
  },

  async set_current_selections_field ({state, commit, dispatch} , { field, selections }) {
    commit("set_current_selections_in_field", { field, selections})
    // for the special case where this is the "schoolReport" and a single item is selected set the value in the state       
    if (state.schoolReport_fields.includes(field)) {
      if (selections.length === 1) {
        await dispatch("set_only_schoolReport", selections[0].text)
      } else {
        await dispatch("set_only_schoolReport", "")
      }
    }
  },

  async set_current_selections ({state, commit, dispatch} , selectionsByField) {
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

      // for the special case where this is the "domain" and a single item is selected set the value in the state       
      if (state.domain_fields.includes(field)) {
        if (selections.length === 1) {
          await dispatch("set_only_domain", selections[0].text)
        } else {
          await dispatch("set_only_domain", "")
        }
      }
    }
  }
}