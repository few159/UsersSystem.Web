export interface ICookieStorageActions {
    action: 'get' | 'getAll' | 'set' | 'delete',
    key: string,
    value?: string,
    options?: {
        path?: string
        expires?: Date
        maxAge?: number
        domain?: string
        secure?: boolean
        httpOnly?: boolean
        sameSite?: 'strict' | 'lax' | 'none'
    }

}