const reports = {
  state: {
    reportName: '',
    formSerialized: '',
    reportPRG: '',
    cachedReports:{}
  },
  mutations: {
    ADD_SELECTED_REPORT: (state, payload) => {
      state.reportName = payload.reportName
      state.formSerialized = payload.formSerialized
      state.reportPRG = payload.reportPRG
    },
    ADD_CACHED_REPORT: (state, payload) => {
      state.cachedReports[payload.ID] = payload.data;
    }
  },
  actions: {
    addSelectedReport({ commit }, payload) {
      commit('ADD_SELECTED_REPORT', payload)
    },
    addCachedReport({ commit }, payload) {
      commit('ADD_CACHED_REPORT', payload)
    }
  }
}

export default reports
