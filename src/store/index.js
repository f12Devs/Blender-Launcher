import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import state from './state.js'
import mutations from './mutations.js'
Vue.use(Vuex)

const store = new Vuex.Store({
    state,
    mutations
})

export default store
