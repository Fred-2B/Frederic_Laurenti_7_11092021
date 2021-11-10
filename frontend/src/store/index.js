import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: {
      url: 'http://localhost:3000/api'
    },
    user: {
      isLogged: false,
      token: null,
      id: null,
      username: null,
      isAdmin: 0
    },
    boxPost: {
      // est lu pour sélectionner le modèle du composant DialogBoxPost
      value: 'closed',
    },
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
