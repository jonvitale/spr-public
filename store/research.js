export const state = () => ({
  initialized: false,
  values: []
})

export const mutations = {
  set_research(state, values) {
    state.values = values
  }
}

export const actions = {
  set_research({ commit }, values) {
    commit('set_research', values)
  }
}
