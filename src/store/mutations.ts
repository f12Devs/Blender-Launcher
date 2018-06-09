import Vue from 'vue'
import { MutationTree } from 'vuex'
import { RootState, Varient } from './types'
const mutations: MutationTree<RootState> = {
    setSelected: (state: RootState, selection: string) => {
        state.selected = selection
    },
    updateVarient: (state: RootState, payload: Varient) => {
        let target = state.varients.find(v => v.name === payload.name)
        if (target) {
            Vue.set(state.varients, state.varients.indexOf(target), {
                ...target,
                ...payload
            })
        }
    }
}
export default mutations
