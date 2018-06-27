import cp from 'child_process'
import DecompressZip from 'decompress-zip'
import fs from 'fs-extra'
import path from 'path'
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
                    path.join(
                        window.process.env.LOCALAPPDATA,
                        'Blender Launcher',
                        this.selected,
                        'blender.exe'
                    ) +
                    '"',
                err => {
                    if (err) alert('Launch ' + err)
                }
            )
        },
        download() {
            const varient = this.selectedVarient
            const startingStatus = varient.status
            const localFile = path.join(
                window.process.env.TEMP,
                varient.remoteVersion + '.zip'
            )
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
                    const extractedPath = path.join(
                        window.process.env.LOCALAPPDATA,
                        'Blender Launcher'
                    )
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
                        const oldPath = path.join(
                            window.process.env.LOCALAPPDATA,
                            'Blender Launcher',
                            varient.name
                        )
                        let folderPath
                        if (log[0].folder) {
                            folderPath = log[0].folder
                                .replace('\\', '/')
                                .split('/')[0]
                        } else if (log[0].stored) {
                            folderPath = log[0].stored
                                .replace('\\', '/')
                                .split('/')[0]
                        } else {
                            folderPath = log[0].deflated
                                .replace('\\', '/')
                                .split('/')[0]
                        }
                        const installedPath = path.join(
                            extractedPath,
                            folderPath
                        )
                        new Promise((resolve, reject) => {
                            fs.appendFile(
                                path.join(
                                    installedPath,
                                    'blenderLauncher.json'
                                ),
                                `{"name": "${varient.name}", "version": "${
                                    varient.remoteVersion
                                }"}`,
                                err => {
                                    if (err) {
                                        setTimeout(() => {
                                            fs.appendFile(
                                                path.join(
                                                    installedPath,
                                                    'blenderLauncher.json'
                                                ),
                                                `{"name": "${
                                                    varient.name
                                                }", "version": "${
                                                    varient.remoteVersion
                                                }"}`,
                                                err2 => {
                                                    if (err2) {
                                                        setTimeout(() => {
                                                            fs.appendFile(
                                                                path.join(
                                                                    installedPath,
                                                                    'blenderLauncher.json'
                                                                ),
                                                                `{"name": "${
                                                                    varient.name
                                                                }", "version": "${
                                                                    varient.remoteVersion
                                                                }"}`,
                                                                err3 => {
                                                                    if (err3) {
                                                                        reject()
                                                                    } else {
                                                                        resolve()
                                                                    }
                                                                }
                                                            )
                                                        }, 5000)
                                                    } else resolve()
                                                }
                                            )
                                        }, 1000)
                                    } else resolve()
                                }
                            )
                        }).then(
                            () => {
                                if (fs.existsSync(oldPath)) {
                                    fs.rename(oldPath, oldPath + '-old', () => {
                                        fs.rename(
                                            installedPath,
                                            oldPath,
                                            () => {
                                                fs.removeSync(oldPath + '-old')
                                                this.$store.commit(
                                                    'updateVarient',
                                                    {
                                                        name: varient.name,
                                                        status: 'Updated',
                                                        version:
                                                            varient.remoteVersion
                                                    }
                                                )
                                                this.progress = 0
                                            }
                                        )
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
                            },
                            err => {
                                this.progress = 0
                                this.$store.commit('updateVarient', {
                                    name: varient.name,
                                    status: startingStatus
                                })
                                fs.removeSync(installedPath)
                                alert('Install ' + err)
                            }
                        )
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
                path.join(
                    window.process.env.LOCALAPPDATA,
                    'Blender Launcher',
                    this.selected
                ),
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
