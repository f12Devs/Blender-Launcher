export interface Varient {
    name: string
    remoteVersion: string
    download: string
    status: string
    installedVersion?: string
}
export interface RootState {
    selected: string
    varients: Varient[]
}
