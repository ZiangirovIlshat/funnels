const eventsList = {
  namespaced: true,
  state: {
    data: [],
    loading: false,
    error: null,
  },

  getters: {
    getVisibleFunnelsData: (state) => state.data.filter(event => event.visible === true)
  },
  
  mutations: {
    SET_EVENTSLIST_DATA(state, payload) {
    
      state.data = payload
    },
    SET_EVENTSLIST_LOADING(state, payload) {
      state.loading = payload
    },
    SET_EVENTSLIST_ERROR(state, payload) {
      state.error = payload
    }
  },
    
  actions: {
    async fetchEventsList({ commit }) {
      commit("SET_EVENTSLIST_LOADING", true);
      try {
        const response = await fetch("https://stat.owen.ru/funnels_api/funnels/list");
        const data = await response.json();

        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        commit("SET_EVENTSLIST_DATA", data);
      } catch (error) {
        commit("SET_EVENTSLIST_ERROR", "<b>Не удалось получить список событий</b>");
      } finally {
        commit("SET_EVENTSLIST_LOADING", false);
      }
    },
  }
}

export default eventsList;