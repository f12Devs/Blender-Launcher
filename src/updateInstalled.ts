import fs from 'fs'
import { Store } from 'vuex'
import { IRootState, IVarient } from './store/types'
export default (store: Store<IRootState>) => {
    const downloadFolder = window.process.env.LOCALAPPDATA + '/Blender Launcher'
    // store.state.varients.forEach(varient => {
    //     store.commit('updateVarient', {
    //         target: store.state.varients.indexOf(varient),
    //         data: { status: 'Not Installed' }
    //     })
    // })
    fs.readdir(downloadFolder, (err, files) => {
        if (err) throw err
        files.forEach((file) => {
            fs.readFile(
                downloadFolder + '/' + file + '/blenderLauncher.json',
                'utf8',
                (fileReadErr, fileContents) => {
                    if (fileReadErr) throw fileReadErr
                    const contents = JSON.parse(fileContents)
                    const storeVarient = store.state.varients.find(
                        (varient: IVarient) => varient.name === contents.name
                    )
                    if (storeVarient == null) return
                    if (storeVarient.remoteVersion === contents.version) {
                        store.commit('updateVarient', {
                            localVersion: contents.version,
                            name: contents.name,
                            status: 'Updated'
                        })
                    } else {
                        store.commit('updateVarient', {
                            localVersion: contents.version,
                            name: contents.name,
                            status: 'Update Avalible'
                        })
                    }
                }
            )
        })
    })
}
