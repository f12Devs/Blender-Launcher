import fs from 'fs'
export default store => {
    let downloadFolder = window.process.env.LOCALAPPDATA + '/Blender Launcher'
    Object.keys(store.state.versions).forEach(key => {
        store.commit('setVarient', {
            target: key,
            data: { status: 'Not Installed' }
        })
    })
    fs.readdir(downloadFolder, (err, files) => {
        if (err) throw err
        files.forEach(file => {
            fs.readFile(
                downloadFolder + '/' + file + '/blenderLauncher.json',
                'utf8',
                (err, fileContents) => {
                    if (err) throw err
                    let contents = JSON.parse(fileContents)
                    if (
                        store.state.versions[contents.name].name ===
                        contents.version
                    ) {
                        store.commit('setVarient', {
                            target: contents.name,
                            data: {
                                status: 'Updated',
                                version: contents.version
                            }
                        })
                    } else {
                        store.commit('setVarient', {
                            target: contents.name,
                            data: {
                                status: 'Update Avalible',
                                version: contents.version
                            }
                        })
                    }
                }
            )
        })
    })
}
