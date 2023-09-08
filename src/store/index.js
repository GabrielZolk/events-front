import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    user: {
      id: '',
      name: '',
      email: '',
      token: '',
    }
  },
  getters: {
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },

    setUser(state, user) {
      state.user = user;
    },
  },
  actions: {
  },
  modules: {
  }
})
