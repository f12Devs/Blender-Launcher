export default {
    setVersion: (state, version) => {
        state.selected = version
    },
    setStatus: (state, status) => {
        state.installed[status.target].status = status.status
    }
}
