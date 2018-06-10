import fs from 'fs'
import request from 'request'
interface IConfiguration {
    remoteFile: string
    localFile: string
    onProgress: (receivedBytes: number, totalBytes: number) => void
}
interface IChunk {
    length: number
}
interface IData {
    headers: {
        'content-length': string
    }
}
export default function downloadFile (configuration: IConfiguration) {
    return new Promise((resolve) => {
        // Save variable to know progress
        let receivedBytes = 0
        let totalBytes = 0

        const req = request({
            method: 'GET',
            uri: configuration.remoteFile
        })

        const out = fs.createWriteStream(configuration.localFile)
        req.pipe(out)

        req.on('response', (data: IData) => {
            // Change the total bytes value to get progress later.
            totalBytes = parseInt(data.headers['content-length'], 10)
        })

        // Get progress if callback exists
        if (configuration.hasOwnProperty('onProgress')) {
            req.on('data', (chunk: IChunk) => {
                // Update the received bytes
                receivedBytes += chunk.length

                configuration.onProgress(receivedBytes, totalBytes)
            })
        } else {
            req.on('data', (chunk: IChunk) => {
                // Update the received bytes
                receivedBytes += chunk.length
            })
        }

        req.on('end', () => {
            resolve()
        })
    })
}
