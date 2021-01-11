export const state = () => ({
  schoolReport_fields: ['schoolReport', 'School Name (Reporting Category)'],
  schoolReport: '', // if one-and-only one reportName is selected
  slugReport: '',
  domain_fields: ['Domain_Name_Possible', 'Domain_Name'],
  domain: '',
  current_selections: {}
})

export const getters = {
  anySelections(state) {
    return Object.keys(state.current_selections)?.length > 0 || false
  },
  oneSchoolSelected(state) {
    return state.slugReport.length >= 1
  },
  oneDomainSelected(state) {
    return state.domain.length >= 1
  }
}

export const mutations = {
  set_only_schoolReport(state, schoolReport) {
    state.schoolReport = schoolReport
  },
  set_only_slugReport(state, slugReport) {
    state.slugReport = slugReport
  },
  set_only_domain(state, domain) {
    state.domain = domain
  },
  set_current_selections_in_field(state, { field, selections }) {
    if (selections !== undefined) {
      state.current_selections[field] = selections
    } else {
      delete state.current_selections[field]
    }
  }
}

export const actions = {
  async set_only_schoolReport({ commit, dispatch }, schoolReport) {
    commit('set_only_schoolReport', schoolReport)
    if (schoolReport) {
      const slugReport = await dispatch(
        'schools/lookup_slugreport_by_schoolreport',
        schoolReport,
        { root: true }
      )
      commit('set_only_slugReport', slugReport)
    } else {
      commit('set_only_slugReport', '')
    }
  },

  set_only_domain({ commit }, domain) {
    commit('set_only_domain', domain)
  },

  async set_current_selections_in_field(
    { state, commit, dispatch },
    { field, selections }
  ) {
    commit('set_current_selections_in_field', { field, selections })
    // console.log('set_current_selections_in_field', field, selections)
    // for the special case where this is the "schoolReport" and a single item is selected set the value in the state
    if (state.schoolReport_fields.includes(field)) {
      if (selections.length === 1) {
        await dispatch('set_only_schoolReport', selections[0].text)
      } else {
        await dispatch('set_only_schoolReport', '')
      }
    }

    // for the special case where this is the "domain" and a single item is selected set the value in the state
    if (state.domain_fields.includes(field)) {
      if (selections.length === 1) {
        await dispatch('set_only_domain', selections[0].text)
      } else {
        await dispatch('set_only_domain', '')
      }
    }

    // for the special case where the year is selected, set the values in the top-level
    if (field === 'Year') {
      await dispatch('set_years', selections, { root: true })
    } else if (field === 'YearEnd') {
      await dispatch(
        'set_years',
        selections.map(({ number }) => ({ text: `${number - 1}-${number}` })),
        { root: true }
      )
    }
  },

  async set_current_selections({ state, commit, dispatch }, selectionsByField) {
    // add any fields that had selections, but now do no not, so they can be removed from state
    const currentFields = Object.keys(selectionsByField)
    const previousFieldsToAdd = Object.keys(state.current_selections).filter(
      field => state.current_selections[field] && !currentFields.includes(field)
    )
    previousFieldsToAdd.forEach(field => (selectionsByField[field] = undefined))

    // for each field in the selections update the stored object
    let field, selections
    for (field in selectionsByField) {
      selections = selectionsByField[field]
      commit('set_current_selections_in_field', { field, selections })
      // for the special case where this is the "schoolReport" and a single item is selected set the value in the state
      if (state.schoolReport_fields.includes(field)) {
        if (selections && selections.length === 1) {
          await dispatch('set_only_schoolReport', selections[0].text)
        } else {
          await dispatch('set_only_schoolReport', '')
        }
      }

      // for the special case where this is the "domain" and a single item is selected set the value in the state
      if (state.domain_fields.includes(field)) {
        if (selections && selections.length === 1) {
          await dispatch('set_only_domain', selections[0].text)
        } else {
          await dispatch('set_only_domain', '')
        }
      }

      // for the special case where the year is selected, set the values in the top-level
      if (field === 'Year') {
        await dispatch('set_years', { Year: selections }, { root: true })
      } else if (field === 'YearEnd') {
        await dispatch(
          'set_years',
          {
            Year:
              selections?.map(({ number }) => ({
                text: `${number - 1}-${number}`
              })) || undefined
          },
          { root: true }
        )
      }
    }
  }
}
