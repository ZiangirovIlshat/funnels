import { createStore } from "vuex";

import eventsList from "./modules/eventsList";
import funnelsData from "./modules/funnelsData";
import funnelsParams from "./modules/funnelsParams";

export default createStore({
  getters: {
    getUnstarredOnly(state) {
      return state.posts.data.filter((post)=> {
        return !state.likedPosts.data.some(likedPosts => {
          return post.id === likedPosts.id
        })
      })
    }
  },
  modules: {
    eventsList,
    funnelsData,
    funnelsParams,
  }
});