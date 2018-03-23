var electronInstaller = require('electron-winstaller')

var resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: 'dist/electron-mat/Blender Launcher-win32-x64',
    outputDirectory: 'dist/winInstaller64',
    authors: 'F12 Developers',
    exe: 'Blender Launcher.exe',
    iconUrl: 'src-electron/icons/icon.ico',
    setupExe: 'Blender_Launcher_Setup.exe'
})

resultPromise.then(
    () => console.log('It worked!'),
    e => console.log(`No dice: ${e.message}`)
)
