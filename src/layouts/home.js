import downloadFile from '../downloader.js'
import os from 'os'
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
            downloadFile({
                remoteFile: this.$store.state.versions[this.selected].download,
                localFile:
                    os.tmpdir() +
                    '/' +
                    this.$store.state.versions[this.$store.state.selected]
                        .name +
                    '.zip',
                onProgress: (received, total) => {
                    this.progress = received * 100 / total
                    console.log(
                        this.progress +
                            '% | ' +
                            received +
                            ' bytes out of ' +
                            total +
                            ' bytes.'
                    )
                }
            }).then(() => {
                this.progress = 0
                this.$store.commit('setStatus', {
                    target: this.$store.state.selected,
                    status: 'Updated'
                })
            })
        }
    },
    props: ['tags']
}
