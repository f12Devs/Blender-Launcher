import mutations from '@/store/mutations'
const { setSelected, setStatus, setVersion, setVariant } = mutations
describe('mutations', () => {
    test('setSelected', () => {
        let state = { selected: 'wrong' }
        setSelected(state, 'right')
        expect(state.selected).toBe('right')
    })
    test('setStatus', () => {
        let state = {
            installed: {
                toChange: {
                    status: 'old'
                },
                dontChange: {
                    status: 'same'
                }
            }
        }
        setStatus(state, { target: 'toChange', status: 'new' })
        expect(state.installed.toChange.status).toBe('new')
        expect(state.installed.dontChange.status).toBe('same')
    })
    test('setVersion', () => {
        let state = {
            installed: {
                toChange: {
                    version: 'old'
                },
                dontChange: {
                    version: 'same'
                }
            },
            versions: {
                toChange: {
                    name: 'new'
                },
                dontChange: {
                    name: 'wrong'
                }
            }
        }
        setVersion(state, 'toChange')
        expect(state.installed.toChange.version).toBe('new')
        expect(state.installed.dontChange.version).toBe('same')
    })
    test('setVariant', () => {
        let state = {
            installed: {
                previous: 'stillHere'
            }
        }
        setVariant(state, { target: 'newVersionA', data: 'thisIsA' })
        setVariant(state, { target: 'newVersionB', data: 'thisIsB' })
        expect(state.installed.previous).toBe('stillHere')
        expect(state.installed.newVersionA).toBe('thisIsA')
        expect(state.installed.newVersionB).toBe('thisIsB')
    })
})
