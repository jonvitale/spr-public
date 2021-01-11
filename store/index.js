export const state = () => ({
  years: [],
  years_all: []
})

const yearToYearEnd = year => parseInt(year.substr(-4))
// const yearToYearShort = year => `${year.substr(0, 4)}-${year.substr(-2)}`
const yearEndToSchoolYear = yearEnd =>
  yearEnd ? `${yearEnd - 1}-${yearEnd}` : '-'
const yearEndToSY = yearEnd =>
  yearEnd ? `${yearEnd - 1}-${yearEnd - 2000}` : '-'
const yearsToYearEndCurrent = years =>
  years
    .map(y => yearToYearEnd(y))
    .reduce((prev, cur) => Math.max(cur, prev || -Infinity), null)
const yearsToYearEndPrevious = years =>
  years
    .map(y => yearToYearEnd(y))
    .filter(y => y < yearsToYearEndCurrent(years))
    .reduce((prev, cur) => Math.max(cur, prev || -Infinity), null)
const yearsToYearEndPrevious2 = years =>
  years
    .map(y => yearToYearEnd(y))
    .filter(y => y < yearsToYearEndPrevious(years))
    .reduce((prev, cur) => Math.max(cur, prev || -Infinity), null)

export const getters = {
  // of the currently available years (determined by filters)
  yearend_c: state => yearsToYearEndCurrent(state.years),
  yearend_p: state => yearsToYearEndPrevious(state.years),
  yearend_p2: state => yearsToYearEndPrevious2(state.years),
  schoolyear_c: state =>
    yearEndToSchoolYear(yearsToYearEndCurrent(state.years)),
  schoolyear_p: state =>
    yearEndToSchoolYear(yearsToYearEndPrevious(state.years)),
  schoolyear_p2: state =>
    yearEndToSchoolYear(yearsToYearEndPrevious2(state.years)),
  sy_c: state => yearEndToSY(yearsToYearEndCurrent(state.years)),
  sy_p: state => yearEndToSY(yearsToYearEndPrevious(state.years)),
  sy_pp: state => yearEndToSY(yearsToYearEndPrevious2(state.years)),

  // of all possible years
  yearend_c_all: state => yearsToYearEndCurrent(state.years_all),
  yearend_p_all: state => yearsToYearEndPrevious(state.years_all),
  yearend_p2_all: state => yearsToYearEndPrevious2(state.years_all),
  schoolyear_c_all: state =>
    yearEndToSchoolYear(yearsToYearEndCurrent(state.years_all)),
  schoolyear_p_all: state =>
    yearEndToSchoolYear(yearsToYearEndPrevious(state.years_all)),
  schoolyear_p2_all: state =>
    yearEndToSchoolYear(yearsToYearEndPrevious2(state.years_all)),
  sy_c_all: state => yearEndToSY(yearsToYearEndCurrent(state.years_all)),
  sy_p_all: state => yearEndToSY(yearsToYearEndPrevious(state.years_all)),
  sy_pp_all: state => yearEndToSY(yearsToYearEndPrevious2(state.years_all))
}

export const mutations = {
  set_years(state, val) {
    state.years = val
  },
  set_years_all(state, val) {
    state.years_all = val
  }
}

export const actions = {
  set_years({ state, commit }, values) {
    console.log('set_years', values)
    let years
    // if there are no values for year we reset to all
    if (values.Year) {
      years = values.Year.map(({ text }) => text)
    } else {
      years = state.years_all
    }
    commit('set_years', years)
  },
  set_years_all({ commit }, values) {
    const years = values.Year.map(({ text }) => text)
    commit('set_years_all', years)
    // since the currently available years must be a subset of all years set these
    commit('set_years', years)
  }
}
