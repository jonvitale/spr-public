export const state = () => ({
  calculator_initialized: false,
  main_initialized: false
})

export const mutations = {
  set_calculator_initialized(state, val) {
    state.calculator_initialized = val
  },
  set_main_initialized(state, val) {
    state.main_initialized = val
  }
}

export const actions = {
  initialize_calculator({ commit }) {
    commit('set_calculator_initialized', true)
  },
  initialize_main({ commit }) {
    commit('set_main_initialized', true)
  }
}
