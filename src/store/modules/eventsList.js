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
        const response = await fetch("https://localhost/funnels_api/funnels/list");
        const data = await response.json();

        commit("SET_EVENTSLIST_DATA", data);
      } catch (error) {
        commit("SET_EVENTSLIST_ERROR", "<b>Ой! Что-то пошло не так... :(</b><br>Не удалось получить данные");
      } finally {
        commit("SET_EVENTSLIST_LOADING", false);
      }
    },
  }
}
  
export default eventsList;