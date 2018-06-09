import downloadFile from '../downloader'
import fs from 'fs-extra'
import cp from 'child_process'
import DecompressZip from 'decompress-zip'
import Vue from 'vue'
import { Varient } from '../store/types'
export default Vue.extend({
    name: 'Home',
    data () {
        return {
            progress: 0
        }
    },
    computed: {
        selected (): string {
            return this.$store.state.selected
        },
        installing () {
            if (
                this.selectedVarient.status === 'Downloading' ||
                this.selectedVarient.status === 'Installing'
            ) {
                return true
            } else {
                return false
            }
        },
        selectedVarient (): Varient {
            return this.$store.state.varients.find(
                (varient: Varient) => varient.name === this.selected
            )
        }
    },
    methods: {
        launch () {
            cp.exec(
                '"' +
                    window.process.env.LOCALAPPDATA +
                    '/Blender Launcher/' +
                    this.selected +
                    '/blender.exe"',
                function (err) {
                    if (err) alert('Launch ' + err)
                }
            )
        },
        download () {
            let varient = this.selectedVarient
            let startingStatus = varient.status
            let target = (): number =>
                this.$store.state.varients.indexOf(varient)
            this.$store.commit('updateVarient', {
                name: varient.name,
                status: 'Downloading'
            })
            let localFile =
                window.process.env.TEMP + '/' + varient.remoteVersion + '.zip'
            downloadFile({
                remoteFile: varient.download,
                localFile,
                onProgress: (received: number, total: number) => {
                    if (this.$store.state.selected === varient.name) {
                        this.progress = parseInt(
                            ((received * 100) / total).toFixed(1)
                        )
                    }
                }
            })
                .then(() => {
                    let extractedPath =
                        window.process.env.LOCALAPPDATA + '/Blender Launcher/'
                    var unzipper = new DecompressZip(localFile)
                    this.$store.commit('updateVarient', {
                        name: varient.name,
                        status: 'Installing'
                    })
                    // Add the error event listener
                    unzipper.on('error', (err: Error) => {
                        this.progress = 0
                        this.$store.commit('updateVarient', {
                            name: varient.name,
                            status: startingStatus
                        })
                        alert('Install ' + err)
                        // console.log('Caught an error', err)
                    })
                    // Notify when everything is extracted
                    unzipper.on('extract', (log: any[]) => {
                        let oldPath =
                            window.process.env.LOCALAPPDATA +
                            '/Blender Launcher/' +
                            varient.name
                        let installedPath = log[0].folder
                            ? extractedPath +
                              log[0].folder.replace('\\', '/').split('/')[0]
                            : log[0].stored
                                ? log[0].stored.replace('\\', '/').split('/')[0]
                                : extractedPath +
                                  log[0].deflated
                                      .replace('\\', '/')
                                      .split('/')[0]
                        fs.appendFile(
                            installedPath + '/blenderLauncher.json',
                            `{"name": "${varient.name}", "version": "${
                                varient.remoteVersion
                            }"}`,
                            err => {
                                if (err) {
                                    setTimeout(() => {
                                        fs.appendFile(
                                            installedPath +
                                                '/blenderLauncher.json',
                                            `{"name": "${
                                                varient.name
                                            }", "version": "${
                                                varient.remoteVersion
                                            }"}`,
                                            err => {
                                                if (err) {
                                                    setTimeout(() => {
                                                        fs.appendFile(
                                                            installedPath +
                                                                '/blenderLauncher.json',
                                                            `{"name": "${
                                                                varient.name
                                                            }", "version": "${
                                                                varient.remoteVersion
                                                            }"}`,
                                                            err => {
                                                                if (err) {
                                                                    this.progress = 0
                                                                    this.$store.commit(
                                                                        'updateVarient',
                                                                        {
                                                                            name:
                                                                                varient.name,
                                                                            status: startingStatus
                                                                        }
                                                                    )
                                                                    alert(
                                                                        'Install ' +
                                                                            err
                                                                    )
                                                                }
                                                            }
                                                        )
                                                    }, 500)
                                                }
                                            }
                                        )
                                    }, 500)
                                }
                            }
                        )
                        if (fs.existsSync(oldPath)) {
                            fs.rename(oldPath, oldPath + '-old', () => {
                                fs.rename(installedPath, oldPath, () => {
                                    fs.removeSync(oldPath + '-old')
                                    this.$store.commit('updateVarient', {
                                        target: target(),
                                        data: {
                                            status: 'Updated',
                                            version: varient.remoteVersion
                                        }
                                    })
                                    this.progress = 0
                                })
                            })
                        } else {
                            fs.rename(installedPath, oldPath, () => {
                                this.$store.commit('updateVarient', {
                                    name: varient.name,
                                    status: 'Updated',
                                    version: varient.remoteVersion
                                })
                                this.progress = 0
                            })
                        }
                    })

                    unzipper.on(
                        'progress',
                        (fileIndex: number, fileCount: number) => {
                            if (this.selected === varient.name) {
                                this.progress = parseInt(
                                    ((fileIndex * 100) / fileCount).toFixed(1)
                                )
                            }
                        }
                    )

                    // Start extraction of the content
                    unzipper.extract({
                        path: extractedPath
                    })
                })
                .catch(err => {
                    alert('Download ' + err)
                    this.progress = 0
                    this.$store.commit('updateVarient', {
                        name: varient.name,
                        status: startingStatus
                    })
                })
        },
        uninstall () {
            fs.remove(
                window.process.env.LOCALAPPDATA + '/Blender Launcher/' + this.selected,
                err => {
                    if (err) {
                        alert('Uninstall ' + err)
                    } else {
                        this.$store.commit('updateVarient', {
                            name: this.selected,
                            status: 'Not Installed'
                        })
                    }
                }
            )
        }
    },
    props: ['tags']
})
