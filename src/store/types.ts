export interface IVariant {
    name: string
    remoteVersion: string
    download: string
    status: string
    installedVersion?: string
}
export interface IRootState {
    selected: string
    variants: IVariant[]
}
