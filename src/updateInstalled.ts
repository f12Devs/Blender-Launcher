import { Varient, RootState } from './store/types'
import fs from 'fs'
import { Store } from 'vuex'
export default (store: Store<RootState>) => {
    let downloadFolder = window.process.env.LOCALAPPDATA + '/Blender Launcher'
    // store.state.varients.forEach(varient => {
    //     store.commit('updateVarient', {
    //         target: store.state.varients.indexOf(varient),
    //         data: { status: 'Not Installed' }
    //     })
    // })
    fs.readdir(downloadFolder, (err, files) => {
        if (err) throw err
        files.forEach(file => {
            fs.readFile(
                downloadFolder + '/' + file + '/blenderLauncher.json',
                'utf8',
                (err, fileContents) => {
                    if (err) throw err
                    let contents = JSON.parse(fileContents)
                    let storeVarient = store.state.varients.find(
                        (varient: Varient) => varient.name === contents.name
                    )
                    if (storeVarient == null) return
                    if (storeVarient.remoteVersion === contents.version) {
                        store.commit('updateVarient', {
                            name: contents.name,
                            status: 'Updated',
                            localVersion: contents.version
                        })
                    } else {
                        store.commit('updateVarient', {
                            name: contents.name,
                            status: 'Update Avalible',
                            localVersion: contents.version
                        })
                    }
                }
            )
        })
    })
}
