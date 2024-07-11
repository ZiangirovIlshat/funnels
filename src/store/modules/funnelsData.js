const funnelsData = {
  namespaced: true,
  state: {
    data: [],
    loading: false,
    error: '',
  },
  
  mutations: {
    SET_FUNNELS_DATA(state, payload) {
      state.data = payload
    },
    SET_FUNNELS_LOADING(state, payload) {
      state.loading = payload
    },
    SET_FUNNELS_ERROR(state, payload) {
      state.error = payload
    }
  },
    
  actions: {
    async fetchFunelsData({ commit }, id) {
      commit("SET_FUNNELS_LOADING", true);
      try {
        const response = await fetch("http://localhost/funnels_api/funnels/get?id=" + id);
        const data = await response.json();
        commit("SET_FUNNELS_DATA", data);
      } catch (error) {
        commit("SET_FUNNELS_ERROR", "<b>Ой! Что-то пошло не так... :(</b><br>Не удалось получить данные");
      } finally {
        commit("SET_FUNNELS_LOADING", false);
      }
    },
  }
}
  
export default funnelsData;