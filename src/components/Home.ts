import cp from 'child_process'
import DecompressZip from 'decompress-zip'
import fs from 'fs-extra'
import Vue from 'vue'
import downloadFile from '../downloader'
import { IVarient } from '../store/types'
export default Vue.extend({
    computed: {
        selected(): string {
            return this.$store.state.selected
        },
        installing() {
            if (
                this.selectedVarient.status === 'Downloading' ||
                this.selectedVarient.status === 'Installing'
            ) {
                return true
            } else {
                return false
            }
        },
        selectedVarient(): IVarient {
            return this.$store.state.varients.find(
                (varient: IVarient) => varient.name === this.selected
            )
        }
    },
    data() {
        return {
            progress: 0
        }
    },
    methods: {
        launch() {
            cp.exec(
                '"' +
                    window.process.env.LOCALAPPDATA +
                    '/Blender Launcher/' +
                    this.selected +
                    '/blender.exe"',
                err => {
                    if (err) alert('Launch ' + err)
                }
            )
        },
        download() {
            const varient = this.selectedVarient
            const startingStatus = varient.status
            const target = (): number =>
                this.$store.state.varients.indexOf(varient)
            this.$store.commit('updateVarient', {
                name: varient.name,
                status: 'Downloading'
            })
            const localFile =
                window.process.env.TEMP + '/' + varient.remoteVersion + '.zip'
            downloadFile({
                localFile,
                onProgress: (received: number, total: number) => {
                    if (this.$store.state.selected === varient.name) {
                        this.progress = parseInt(
                            ((received * 100) / total).toFixed(1),
                            10
                        )
                    }
                },
                remoteFile: varient.download
            })
                .then(() => {
                    const extractedPath =
                        window.process.env.LOCALAPPDATA + '/Blender Launcher/'
                    const unzipper = new DecompressZip(localFile)
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
                        const oldPath =
                            window.process.env.LOCALAPPDATA +
                            '/Blender Launcher/' +
                            varient.name
                        const installedPath = log[0].folder
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
                                            err2 => {
                                                if (err2) {
                                                    setTimeout(() => {
                                                        fs.appendFile(
                                                            installedPath +
                                                                '/blenderLauncher.json',
                                                            `{"name": "${
                                                                varient.name
                                                            }", "version": "${
                                                                varient.remoteVersion
                                                            }"}`,
                                                            err3 => {
                                                                if (err3) {
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
                                                                            err3
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
                                        data: {
                                            status: 'Updated',
                                            version: varient.remoteVersion
                                        },
                                        target: target()
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
                                    ((fileIndex * 100) / fileCount).toFixed(1),
                                    10
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
        uninstall() {
            fs.remove(
                window.process.env.LOCALAPPDATA +
                    '/Blender Launcher/' +
                    this.selected,
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
    name: 'Home',
    props: ['tags']
})
