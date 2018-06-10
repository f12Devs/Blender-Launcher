import Vue from 'vue'
import { MutationTree } from 'vuex'
import { IRootState, IVarient } from './types'
const mutations: MutationTree<IRootState> = {
    setSelected: (state: IRootState, selection: string) => {
        state.selected = selection
    },
    updateVarient: (state: IRootState, payload: IVarient) => {
        const target = state.varients.find((v) => v.name === payload.name)
        if (target) {
            Vue.set(state.varients, state.varients.indexOf(target), {
                ...target,
                ...payload
            })
        }
    }
}
export default mutations
