import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    imageBase64: '',
    createdEventId: null,
    selectedEvent: null,
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

    setImageBase64(state, imageBase64) {
      state.imageBase64 = imageBase64;
    },

    setCreatedEventId(state, createdEventId) {
      state.createdEventId = createdEventId;
    },

    setSelectedEvent(state, selectedEvent) {
      state.selectedEvent = selectedEvent;
    },
  },
  actions: {
  },
  modules: {
  }
})
