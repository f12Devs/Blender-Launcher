import downloadFile from '../downloader.js'
import os from 'os'
import fs from 'fs-extra'
import DecompressZip from 'decompress-zip'
export default {
    name: 'Home',
    data () {
        return {
            progress: 0
        }
    },
    computed: {
        selected () {
            // if (typeof(this.$store.state.selected)=='string') {
            return this.$store.state.selected
            // } else {
            //     return this.$store.state.selected.toString()
            // }
        },
        installing () {
            if (
                this.$store.state.installed[this.$store.state.selected]
                    .status === 'Downloading' ||
                this.$store.state.installed[this.$store.state.selected]
                    .status === 'Installing'
            ) {
                return true
            } else {
                return false
            }
        },
        installedVersion () {
            if (typeof this.$store.state.selected === 'string') {
                return this.$store.state.installed[this.selected]
            } else {
                return this.$store.state.installed[this.selected.toString()]
            }
        }
    },
    methods: {
        download () {
            let version = this.$store.state.selected
            this.$store.commit('setStatus', {
                target: version,
                status: 'Downloading'
            })
            let localFile =
                os.tmpdir() +
                '/' +
                this.$store.state.versions[version].name +
                '.zip'
            // downloadFile({
            //     remoteFile: this.$store.state.versions[this.selected].download,
            //     localFile,
            //     onProgress: (received, total) => {
            //         if (this.$store.state.selected === version) {
            //             this.progress = parseInt(
            //                 (received * 100 / total).toFixed(1)
            //             )
            //         }
            //     }
            // }).then(() => {
            let extractedPath =
                os.homedir() + '/AppData/Local/Blender Launcher/'
            var unzipper = new DecompressZip(localFile)
            this.$store.commit('setStatus', {
                target: version,
                status: 'Installing'
            })
            // Add the error event listener
            unzipper.on('error', function (err) {
                console.log('Caught an error', err)
            })

            // Notify when everything is extracted
            unzipper.on('extract', log => {
                let oldPath =
                    os.homedir() + '/AppData/Local/Blender Launcher/' + version
                setTimeout(() => {
                    if (fs.existsSync(oldPath)) {
                        // Do something
                        fs.rename(oldPath, oldPath + '-old', () => {
                            fs.rename(
                                log[0].folder
                                    ? extractedPath +
                                      log[0].folder.split('\\')[0]
                                    : extractedPath +
                                      log[0].deflated.split('\\')[0],
                                oldPath,
                                () => {
                                    fs.removeSync(oldPath + '-old')
                                    this.$store.commit('setStatus', {
                                        target: version,
                                        status: 'Updated'
                                    })
                                    this.$store.commit('setVersion', version)
                                    this.progress = 0
                                }
                            )
                        })
                    } else {
                        fs.rename(
                            log[0].folder !== undefined
                                ? extractedPath + log[0].folder.split('\\')[0]
                                : extractedPath +
                                  log[0].deflated.split('\\')[0],
                            oldPath,
                            () => {
                                this.$store.commit('setStatus', {
                                    target: version,
                                    status: 'Updated'
                                })
                                this.$store.commit('setVersion', version)
                                this.progress = 0
                            }
                        )
                    }
                }, 500)
            })

            unzipper.on('progress', (fileIndex, fileCount) => {
                if (this.$store.state.selected === version) {
                    this.progress = parseInt(
                        (fileIndex * 100 / fileCount).toFixed(1)
                    )
                }
            })

            // Start extraction of the content
            unzipper.extract({
                path: extractedPath
            })
            // })
        }
    },
    props: ['tags']
}
