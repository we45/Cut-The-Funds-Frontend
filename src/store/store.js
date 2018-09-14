import axios from '@/utils/auth'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    email: null,
    token: null,
    userType: null
  },
  mutations: {
    authUser(state, userData) {
      state.token = userData.token
      state.email = userData.email
      state.userType = userData.userType
    }
  },
  actions: {
    login({ commit, dispatch }, authData) {
      axios.post('/users/login/', {
        email: authData.email,
        password: authData.password
      })
        .then(res => {
          localStorage.setItem('email', res.data.email)
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userType', res.data.userType)
          commit('authUser', {
            email: res.data.email,
            token: res.data.token,
            userType: res.data.userType
          })
        }).catch(error => {
          console.log(error)
        })
    },
    logout({ commit, dispatch}){
      commit('authUser', {
            email: '',
            token: '',
            userType: ''
          })
    }
  }
})

export default store
