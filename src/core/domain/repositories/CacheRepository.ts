export interface CacheRepository{
    get<T>(key: string): Promise<T | null>
    set<T = any>(key:string, data: T):Promise<void>
    // setEx<T = any>(key:string, expireIn: number, data: T):Promise<void>
    // remove(key: string[]): Promise<void>
    // command(command:string, options: string[]): Promise<any>
}