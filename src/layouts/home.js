import downloadFile from '../downloader.js'
import fs from 'fs-extra'
import cp from 'child_process'
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
        launch () {
            cp.exec(
                '"' +
                    window.process.env.LOCALAPPDATA +
                    '\\Blender Launcher\\' +
                    this.$store.state.selected +
                    '\\blender.exe"',
                function (err, data) {
                    console.log(err)
                    console.log(data.toString())
                }
            )
        },
        download () {
            let varient = this.$store.state.selected
            let version = this.$store.state.versions[varient].name
            this.$store.commit('setStatus', {
                target: varient,
                status: 'Downloading'
            })
            let localFile = window.process.env.TEMP + '/' + version + '.zip'
            downloadFile({
                remoteFile: this.$store.state.versions[varient].download,
                localFile,
                onProgress: (received, total) => {
                    if (this.$store.state.selected === varient) {
                        this.progress = parseInt(
                            (received * 100 / total).toFixed(1)
                        )
                    }
                }
            })
                .then(() => {
                    let extractedPath =
                        window.process.env.LOCALAPPDATA + '/Blender Launcher/'
                    var unzipper = new DecompressZip(localFile)
                    this.$store.commit('setStatus', {
                        target: varient,
                        status: 'Installing'
                    })
                    // Add the error event listener
                    unzipper.on('error', err => {
                        alert('Install ' + err)
                        this.progress = 0
                        this.$store.commit('setStatus', {
                            target: varient,
                            status: 'Update Avalible'
                        })
                        console.log('Caught an error', err)
                    })

                    // Notify when everything is extracted
                    unzipper.on('extract', log => {
                        let oldPath =
                            window.process.env.LOCALAPPDATA +
                            '/Blender Launcher/' +
                            varient
                        // setTimeout(() => {
                        let installedPath = log[0].folder
                            ? extractedPath + log[0].folder.split('\\')[0]
                            : extractedPath + log[0].deflated.split('\\')[0]
                        fs.appendFile(
                            installedPath + '/blenderLauncher.json',
                            `{"name": "${varient}", "version": "${version}"}`,
                            function (err) {
                                if (err) throw err
                            }
                        )
                        if (fs.existsSync(oldPath)) {
                            // Do something
                            fs.rename(oldPath, oldPath + '-old', () => {
                                fs.rename(installedPath, oldPath, () => {
                                    fs.removeSync(oldPath + '-old')
                                    this.$store.commit('setStatus', {
                                        target: varient,
                                        status: 'Updated'
                                    })
                                    this.$store.commit('setVersion', varient)
                                    this.progress = 0
                                })
                            })
                        } else {
                            fs.rename(installedPath, oldPath, () => {
                                this.$store.commit('setStatus', {
                                    target: varient,
                                    status: 'Updated'
                                })
                                this.$store.commit('setVersion', varient)
                                this.progress = 0
                            })
                        }
                        // }, 500)
                    })

                    unzipper.on('progress', (fileIndex, fileCount) => {
                        if (this.$store.state.selected === varient) {
                            this.progress = parseInt(
                                (fileIndex * 100 / fileCount).toFixed(1)
                            )
                        }
                    })

                    // Start extraction of the content
                    unzipper.extract({
                        path: extractedPath
                    })
                })
                .catch(err => {
                    alert('Download Error:' + err)
                    this.progress = 0
                    this.$store.commit('setStatus', {
                        target: version,
                        status: 'Update Avalible'
                    })
                })
        }
    },
    props: ['tags']
}
