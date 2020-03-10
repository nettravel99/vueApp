const booking = {
  state: {
    resource: '',
    start: '',
    end: '',
    new: '',
    id: ''
  },
  mutations: {
    ADD_BOOKING: (state, payload) => {
      state.id = ''
      state.resource = payload.resource
      state.start = payload.start
      state.end = payload.end
      state.resource = payload.resource
      state.new = true
    },
    EDIT_BOOKING: (state, payload) => {
      state.id = ''
      state.id = payload.id,
      state.new = false
    }
  },
  actions: {
    addBooking({ commit }, payload) {
      commit('ADD_BOOKING', payload)
    },
    editBooking({ commit }, payload) {
      commit('EDIT_BOOKING', payload)
    }
  }
}

export default booking
