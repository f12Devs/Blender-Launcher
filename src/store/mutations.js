export default {
    setSelected: (state, version) => {
        state.selected = version
    },
    setStatus: (state, status) => {
        state.installed[status.target].status = status.status
    },
    setVersion: (state, version) => {
        state.installed[version].version = state.versions[version].name
    }
}
