const account = {
  state: {
    account: ''
  },
  mutations: {
    ADD_SELECTED_ACCOUNT: (state, payload) => {
      state.account = payload.account
    }
  },
  actions: {
    addSelectedAccount({ commit }, payload) {
      commit('ADD_SELECTED_ACCOUNT', payload)
    }
  }
}

export default account
