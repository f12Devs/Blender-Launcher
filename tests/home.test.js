import { shallow, createLocalVue } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import Vuex from 'vuex'
import Quasar, * as All from 'quasar-framework/dist/quasar.mat.esm.js'
import mutations from '@/store/mutations.js'
import state from '@/store/state.js'
import home from '@/layouts/home.vue'
import cp from 'child_process'
jest.mock('child_process')
import fs from 'fs-extra'
jest.mock('fs-extra')
import DecompressZip, { mockExtract, mockOn } from 'decompress-zip'
jest.mock('decompress-zip')
import download from '@/downloader.js'
jest.mock('@/downloader.js')
global.alert = jest.fn()

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Quasar, {
    components: All,
    directives: All
})
let store
describe('Component', () => {
    beforeEach(() => {
        // fs.mockClear()
        global.alert.mockClear()
        download.mockClear()
        DecompressZip.mockClear()
        mockExtract.mockClear()
        Object.keys(state.versions).forEach(k => {
            state.installed[k] = {
                version: 'oldVersion',
                status: 'Not Installed'
            }
        })
        store = new Vuex.Store({
            state,
            mutations
        })
    })
    test('download function cleans up old installation and renames new one', async () => {
        const vm = shallow(home, { store, localVue }).vm
        fs.existsSync.mockImplementationOnce(path => {
            if (
                path ===
                window.process.env.LOCALAPPDATA + '/Blender Launcher/Stable'
            ) {
                return true
            } else return false
        })
        fs.rename.mockImplementation((old, target, callback) => {
            callback()
        })
        fs.removeSync = jest.fn()
        await vm.download()
        expect(fs.rename).toHaveBeenCalledTimes(2)
        let oldPath =
            window.process.env.LOCALAPPDATA + '/Blender Launcher/Stable'
        expect(fs.rename.mock.calls[0][0]).toBe(oldPath)
        expect(fs.rename.mock.calls[0][1]).toBe(oldPath + '-old')
        expect(fs.rename.mock.calls[1][0]).toBe(
            window.process.env.LOCALAPPDATA + '/Blender Launcher/Stable'
        )
        expect(fs.rename.mock.calls[1][1]).toBe(oldPath)
        expect(fs.removeSync).toBeCalledWith(oldPath + '-old')
    })
    test('download function downloads and extracts the proper file', async () => {
        const vm = shallow(home, { store, localVue }).vm
        await vm.download()
        expect(download).toHaveBeenCalledTimes(1)
        expect(download.mock.calls[0][0].remoteFile).toBe(
            vm.$store.state.versions.Stable.download
        )
        expect(download.mock.calls[0][0].localFile).toBe(
            window.process.env.TEMP +
                '/' +
                vm.$store.state.versions.Stable.name +
                '.zip'
        )
        expect(fs.appendFile.mock.calls[0][0]).toBe(
            window.process.env.LOCALAPPDATA +
                '/Blender Launcher/Stable/blenderLauncher.json'
        )
        expect(fs.appendFile.mock.calls[0][1]).toBe(
            `{"name": "Stable", "version": "${
                vm.$store.state.versions.Stable.name
            }"}`
        )
        expect(fs.rename).toBeCalled()
    })
    test('progress is updated as file downloads', async () => {
        // console.log(window.process.env)
        let downloadCallback = () => {}
        fs.rename.mockImplementationOnce((old, target, callback) => {
            downloadCallback = callback
        })
        const vm = shallow(home, { store, localVue }).vm
        expect(vm.progress).toBe(0)
        expect(vm.$store.state.installed.Stable.status).toBe('Not Installed')
        expect(vm.installing).toBeFalsy()
        expect(download).not.toBeCalled()
        vm.download()
        expect(vm.$store.state.installed.Stable.status).toBe('Downloading')
        expect(download).toHaveBeenCalledTimes(1)
        expect(vm.progress).toBe(50)
        expect(mockExtract).not.toHaveBeenCalled()
        await flushPromises()
        expect(vm.$store.state.installed.Stable.status).toBe('Installing')
        expect(vm.progress).toBe(50)
        expect(mockExtract).toHaveBeenCalledTimes(1)
        expect(vm.$store.state.installed.Stable.version).toBe('oldVersion')
        downloadCallback()
        expect(vm.$store.state.installed.Stable.status).toBe('Updated')
        expect(vm.$store.state.installed.Stable.version).toBe(
            vm.$store.state.versions.Stable.name
        )
    })
    test('handles download error gracefully', async () => {
        const vm = shallow(home, { store, localVue }).vm
        download.mockImplementationOnce(() => {
            return new Promise((resolve, reject) => {
                reject(new Error('this is the error'))
            })
        })
        vm.download()
        await flushPromises()
        expect(global.alert).toBeCalledWith('Download Error: this is the error')
        expect(vm.$store.state.installed.Stable.status).toBe('Update Avalible')
        expect(vm.progress).toBe(0)
    })
    test('handles extract error gracefully', async done => {
        global.alert = jest.fn().mockImplementationOnce(message => {
            expect(message).toBe('Install Error: this is the error')
            expect(vm.progress).toBe(0)
            expect(vm.$store.state.installed.Stable.status).toBe(
                'Update Avalible'
            )
            done()
        })
        const vm = shallow(home, { store, localVue }).vm
        mockOn.mockImplementationOnce((event, callback) => {
            if (event === 'error') callback(new Error('this is the error'))
        })
        vm.download()
    })
    test('handles uninstall error gracefully', () => {
        fs.remove = jest.fn().mockImplementationOnce((target, callback) => {
            callback(new Error('this is the error'))
        })
        const vm = shallow(home, { store, localVue }).vm
        vm.uninstall()
        expect(global.alert).toBeCalledWith(
            'Uninstall Error: this is the error'
        )
    })
    test('handles launch error gracefully', () => {
        cp.exec = jest.fn().mockImplementationOnce((target, callback) => {
            callback(new Error('this is the error'))
            expect(global.alert).toBeCalledWith(
                'Launch Error: this is the error'
            )
        })
    })
    test('handles blenderLauncher.json file creation error gracefully and retries', async () => {
        jest.useFakeTimers()
        const vm = shallow(home, { store, localVue }).vm
        fs.appendFile.mockClear()
        fs.appendFile.mockImplementation((target, content, callback) => {
            callback(new Error('this is the error'))
        })
        await vm.download()
        expect(fs.appendFile).toHaveBeenCalledTimes(1)
        jest.advanceTimersByTime(500)
        expect(fs.appendFile).toHaveBeenCalledTimes(2)
        jest.advanceTimersByTime(500)
        expect(fs.appendFile).toHaveBeenCalledTimes(3)
        expect(global.alert).toHaveBeenCalledWith(
            'Install Error: this is the error'
        )
        fs.appendFile.mockClear()
    })
    test('uninstalls selected version', () => {
        fs.remove = jest.fn().mockImplementationOnce((target, callback) => {
            callback()
        })
        const vm = shallow(home, { store, localVue }).vm
        vm.uninstall()
        expect(fs.remove.mock.calls[0][0]).toBe(
            window.process.env.LOCALAPPDATA + '/Blender Launcher/Stable'
        )
        expect(vm.$store.state.installed.Stable.status).toBe('Not Installed')
    })
    test('launches proper file', () => {
        const vm = shallow(home, { store, localVue }).vm
        vm.launch()
        expect(cp.exec).toBeCalled()
        expect(cp.exec.mock.calls[0][0]).toBe(
            '"' +
                window.process.env.LOCALAPPDATA +
                '\\Blender Launcher\\Stable\\blender.exe"'
        )
    })
    test('download works with different varient selected', async () => {
        const vm = shallow(home, { store, localVue }).vm
        vm.$store.commit('setSelected', 'Official,New Compiler')
        expect(() => {
            vm.download()
        }).not.toThrow()
    })
})
