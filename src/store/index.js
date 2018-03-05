import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import state from './state.js'
Vue.use(Vuex)

const store = new Vuex.Store({
    state
})

export default store
