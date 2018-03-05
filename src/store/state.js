export default {
    versions: {
        stable: {
            version: '2.79a',
            download:
                'https://www.blender.org/download/Blender2.79/blender-2.79a-windows64.zip/'
        },
        experimental: [
            {
                name: 'blender-2.79-94b9994-win64',
                tags: ['Official'],
                download:
                    'https://builder.blender.org/download//blender-2.79-94b9994-win64.zip'
            },
            {
                name: 'blender-2.79-94b9994-win64-vc14',
                tags: ['Official', 'New Compiler'],
                download:
                    'https://builder.blender.org/download//blender-2.79-94b9994-win64-vc14.zip'
            },
            {
                name: 'blender-2.80-3fc2d12-win64',
                tags: ['Blender 2.8 Project'],
                download:
                    'https://builder.blender.org/download//blender-2.80-3fc2d12-win64.zip'
            },
            {
                name: 'blender-2.80-3fc2d12-win64-vc14',
                tags: ['Blender 2.8 Project', 'New Compiler'],
                download:
                    'https://builder.blender.org/download//blender-2.80-3fc2d12-win64-vc14.zip'
            }
        ]
    }
}
