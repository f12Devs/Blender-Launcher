import fs from 'fs'
import path from 'path'
import { Store } from 'vuex'
import { IRootState, IVariant } from './store/types'
export default (store: Store<IRootState>) => {
    const downloadFolder = path.join(
        window.process.env.LOCALAPPDATA,
        'Blender Launcher'
    )
    fs.readdir(downloadFolder, (err, files) => {
        if (err) throw err
        files.forEach(file => {
            fs.readFile(
                downloadFolder + '/' + file + '/blenderLauncher.json',
                'utf8',
                (fileReadErr, fileContents) => {
                    if (fileReadErr) throw fileReadErr
                    const contents = JSON.parse(fileContents)
                    const storeVariant = store.state.variants.find(
                        (variant: IVariant) => variant.name === contents.name
                    )
                    if (storeVariant == null) return
                    if (storeVariant.remoteVersion === contents.version) {
                        store.commit('updateVariant', {
                            localVersion: contents.version,
                            name: contents.name,
                            status: 'Updated'
                        })
                    } else {
                        store.commit('updateVariant', {
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
