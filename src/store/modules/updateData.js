const updateData = {
  namespaced: true,
  state: {
    data: [],
    loading: false,
    error: '',
  },

  mutations: {
    SET_UPDATEDATA_DATA(state, payload) {
      state.data = payload
    },
    SET_UPDATEDATA_LOADING(state, payload) {
      state.loading = payload
    },
    SET_UPDATEDATA_ERROR(state, payload) {
      state.error = payload
    }
  },

  actions: {
    async fetchUpdateData({ commit }, data) {
      commit("SET_UPDATEDATA_DATA", "");

      commit("SET_UPDATEDATA_LOADING", true);
      try {
        const response = await fetch("https://localhost/funnels_api/admin/update", {
          method: "POST",
          body: data
        });

        const responseText = await response.json();
        
        commit("SET_UPDATEDATA_DATA", responseText);
      } catch (error) {
        console.log(data)
        commit("SET_UPDATEDATA_ERROR", "Не удалось добавить данные");
      } finally {
        commit("SET_UPDATEDATA_LOADING", false);
      }
    },
  }
}
  
export default updateData;