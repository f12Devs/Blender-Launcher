import Vue from 'vue'
export default {
    setSelected: (state, version) => {
        state.selected = version
    },
    setStatus: (state, status) => {
        state.installed[status.target].status = status.status
    },
    setVersion: (state, version) => {
        state.installed[version].version = state.versions[version].name
    },
    setVarient: (state, varient) => {
        Vue.set(state.installed, varient.target, varient.data)
        // state.installed[varient.target] = varient.data
    }
}
