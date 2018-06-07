import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import state from './state'
import mutations from './mutations'
Vue.use(Vuex)

const store = new Vuex.Store({
    state,
    mutations
})

export default store
