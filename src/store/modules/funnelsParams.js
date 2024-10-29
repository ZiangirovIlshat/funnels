const funnelsParams = {
  namespaced: true,
  state: {
    data: [],
    loading: false,
    error: '',
  },

  mutations: {
    SET_FUNNELSPARAMS_DATA(state, payload) {
      state.data = payload
    },
    SET_FUNNELSPARAMS_LOADING(state, payload) {
      state.loading = payload
    },
    SET_FUNNELSPARAMS_ERROR(state, payload) {
      state.error = payload
    }
  },

  actions: {
    async fetchFunelsParams({ commit }, id) {
      commit("SET_FUNNELSPARAMS_LOADING", true);
      try {
        const response = await fetch("https://stat.owen.ru/funnels_api/admin/get?id=" + id);
        const data = await response.json();

        commit("SET_FUNNELSPARAMS_DATA", data);
      } catch (error) {
        commit("SET_FUNNELSPARAMS_ERROR", "<b>Ой! Что-то пошло не так... :(</b><br>Не удалось получить данные");
      } finally {
        commit("SET_FUNNELSPARAMS_LOADING", false);
      }
    },
  }
}

export default funnelsParams;