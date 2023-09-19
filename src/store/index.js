import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../api/axios-config';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    imageBase64: '',
    createdEventId: null,
    selectedEvent: null,
    contactsFilter: [],
    tagsFilter: [],
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

    setContactsFilter(state, contactsFilter) {
      state.contactsFilter = contactsFilter;
    },

    setTagsFilter(state, tagsFilter) {
      state.tagsFilter = tagsFilter;
    }
  },
  actions: {
    getContactsFilter({ commit }, user_id) {
      axios.get(`/users/${user_id}/contacts`)
      .then(response => {
        const namesArray = response.data.contacts.map(contact => contact.name);
        commit('setContactsFilter', namesArray);
      })
      .catch(error => {
        console.error('Error fetching contacts filter');
      });
    },

    getTagsFilter({ commit }) {
      axios.get('/tags')
      .then(response => {
        const namesArray = response.data.tags.map(tag => tag.name);
        commit('setTagsFilter', namesArray);
      })
      .catch(error => {
        console.error('Error fetching tasks filter');
      });
    }
  },
  modules: {
  }
})
