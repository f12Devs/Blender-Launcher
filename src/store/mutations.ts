import Vue from 'vue'
import { MutationTree } from 'vuex'
import { IRootState, IVariant } from './types'
const mutations: MutationTree<IRootState> = {
    setSelected: (state: IRootState, selection: string) => {
        state.selected = selection
    },
    updateVariant: (state: IRootState, payload: IVariant) => {
        const target = state.variants.find(v => v.name === payload.name)
        if (target) {
            Vue.set(state.variants, state.variants.indexOf(target), {
                ...target,
                ...payload
            })
        }
    }
}
export default mutations
