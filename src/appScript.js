import home from './layouts/home.vue'
import fs from 'fs'
export default {
    name: 'App',
    data () {
        return {
            leftDrawerOpen: false
        }
    },
    created () {
        let downloadFolder =
            window.process.env.LOCALAPPDATA + '/Blender Launcher'
        Object.keys(this.$store.state.versions).forEach(key => {
            this.$store.commit('setVarient', {
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
                            this.$store.state.versions[contents.name].name ===
                            contents.version
                        ) {
                            this.$store.commit('setVarient', {
                                target: contents.name,
                                data: {
                                    status: 'Updated',
                                    version: contents.version
                                }
                            })
                        } else {
                            this.$store.commit('setVarient', {
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
    },
    components: { home }
}
