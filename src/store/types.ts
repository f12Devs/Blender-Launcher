export interface IVariant {
    name: string
    remoteVersion: string
    download: string
    status: string
    installedVersion?: string
}
export interface IRootState {
    installPath: string
    selected: string
    variants: IVariant[]
}
