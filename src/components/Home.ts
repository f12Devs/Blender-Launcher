import cp from 'child_process'
import DecompressZip from 'decompress-zip'
import fs from 'fs-extra'
import path from 'path'
import Vue from 'vue'
import downloadFile from '../downloader'
import { IVariant } from '../store/types'
export default Vue.extend({
    computed: {
        selected (): string {
            return this.$store.state.selected
        },
        installing () {
            if (
                this.selectedVariant.status === 'Downloading' ||
                this.selectedVariant.status === 'Installing'
            ) {
                return true
            } else {
                return false
            }
        },
        selectedVariant (): IVariant {
            return this.$store.state.variants.find(
                (variant: IVariant) => variant.name === this.selected
            )
        }
    },
    data () {
        return {
            progress: 0
        }
    },
    methods: {
        launch () {
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
        download () {
            const variant = this.selectedVariant
            const startingStatus = variant.status
            const localFile = path.join(
                window.process.env.TEMP,
                variant.remoteVersion + '.zip'
            )
            downloadFile({
                localFile,
                onProgress: (received: number, total: number) => {
                    if (this.$store.state.selected === variant.name) {
                        this.progress = parseInt(
                            ((received * 100) / total).toFixed(1),
                            10
                        )
                    }
                },
                remoteFile: variant.download
            })
                .then(() => {
                    const extractedPath = path.join(
                        window.process.env.LOCALAPPDATA,
                        'Blender Launcher'
                    )
                    const unzipper = new DecompressZip(localFile)
                    this.$store.commit('updateVariant', {
                        name: variant.name,
                        status: 'Installing'
                    })
                    // Add the error event listener
                    unzipper.on('error', (err: Error) => {
                        this.progress = 0
                        this.$store.commit('updateVariant', {
                            name: variant.name,
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
                            variant.name
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
                                `{"name": "${variant.name}", "version": "${
                                    variant.remoteVersion
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
                                                    variant.name
                                                }", "version": "${
                                                    variant.remoteVersion
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
                                                                    variant.name
                                                                }", "version": "${
                                                                    variant.remoteVersion
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
                                                    'updateVariant',
                                                    {
                                                        name: variant.name,
                                                        status: 'Updated',
                                                        version:
                                                            variant.remoteVersion
                                                    }
                                                )
                                                this.progress = 0
                                            }
                                        )
                                    })
                                } else {
                                    fs.rename(installedPath, oldPath, () => {
                                        this.$store.commit('updateVariant', {
                                            name: variant.name,
                                            status: 'Updated',
                                            version: variant.remoteVersion
                                        })
                                        this.progress = 0
                                    })
                                }
                            },
                            err => {
                                this.progress = 0
                                this.$store.commit('updateVariant', {
                                    name: variant.name,
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
                            if (this.selected === variant.name) {
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
                    this.$store.commit('updateVariant', {
                        name: variant.name,
                        status: startingStatus
                    })
                })
        },
        uninstall () {
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
                        this.$store.commit('updateVariant', {
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
