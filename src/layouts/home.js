import downloadFile from '../downloader.js'
import os from 'os'
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
            this.$store.commit('setStatus', {
                target: this.$store.state.selected,
                status: 'Downloading'
            })
            let localFile =
                os.tmpdir() +
                '/' +
                this.$store.state.versions[this.$store.state.selected].name +
                '.zip'
            downloadFile({
                // remoteFile: 'https://www.colorado.edu/conflict/peace/download/peace.zip', // sample file for quick downloads
                remoteFile: this.$store.state.versions[this.selected].download,
                localFile,
                onProgress: (received, total) => {
                    this.progress = parseInt(
                        (received * 100 / total).toFixed(1)
                    )
                }
            }).then(() => {
                var unzipper = new DecompressZip(localFile)
                this.$store.commit('setStatus', {
                    target: this.$store.state.selected,
                    status: 'Installing'
                })
                // Add the error event listener
                unzipper.on('error', function (err) {
                    console.log('Caught an error', err)
                })

                // Notify when everything is extracted
                unzipper.on('extract', log => {
                    this.$store.commit('setStatus', {
                        target: this.$store.state.selected,
                        status: 'Updated'
                    })
                    this.progress = 0
                    console.log('Finished extracting', log)
                })

                unzipper.on('progress', (fileIndex, fileCount) => {
                    this.progress = parseInt(
                        (fileIndex * 100 / fileCount).toFixed(1)
                    )
                })

                // Start extraction of the content
                unzipper.extract({
                    path: os.homedir() + '/AppData/Local/Blender Launcher'
                    // You can filter the files that you want to unpack using the filter option
                    // filter: function (file) {
                    // console.log(file);
                    // return file.type !== "SymbolicLink";
                    // }
                })
            })
        }
    },
    props: ['tags']
}
