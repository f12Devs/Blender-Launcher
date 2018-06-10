export interface IVarient {
    name: string
    remoteVersion: string
    download: string
    status: string
    installedVersion?: string
}
export interface IRootState {
    selected: string
    varients: IVarient[]
}
