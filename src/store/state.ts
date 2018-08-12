import { remote } from 'electron'
import path from 'path'

export default {
    installPath: path.join(
        process.env.LOCALAPPDATA || remote.app.getPath('appData'),
        'blender_installs'
    ),
    selected: 'Stable',
    variants: [
        {
            download:
                'http://dl.dropboxusercontent.com/s/p9vk9twwgw51dho/thing.zip?dl=0',
            name: 'Stable',
            remoteVersion: '2.79a',
            status: 'Not Installed'
        },
        {
            download:
                'https://mirror.clarkson.edu/blender/release/Blender2.79/blender-2.79b-linux-glibc219-x86_64.tar.bz2',
            name: 'linux',
            remoteVersion: 'blender-2.79-94b9994-win64',
            status: 'Not Installed'
        },
        {
            download:
                'https://builder.blender.org/download//blender-2.79-94b9994-win64-vc14.zip',
            name: 'Official,New Compiler',
            remoteVersion: 'blender-2.79-94b9994-win64-vc14',
            status: 'Not Installed'
        },
        {
            download:
                'https://builder.blender.org/download//blender-2.80-3fc2d12-win64.zip',
            name: 'Blender 2.8',
            remoteVersion: 'blender-2.80-3fc2d12-win64',
            status: 'Not Installed'
        },
        {
            download:
                'https://builder.blender.org/download/blender-2.80-6939523-win64-vc14.zip',
            name: 'Blender 2.8,New Compiler',
            remoteVersion: 'blender-2.80-ebbb55d-win64-vc14',
            status: 'Not Installed'
        }
    ]
}
