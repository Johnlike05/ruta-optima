// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { DEPENDENCY_CONTAINER } from '@/configuration/DependecyContainer';
import { TYPESDEPENDENCIES } from '@/configuration/TypesDependencies';
import { CacheRepository } from '@/core/domain/repositories/CacheRepository';
import { injectable } from 'inversify';
import Redis, { Command } from 'ioredis';

@injectable()
export class CacheGenericDao implements CacheRepository {

    private redis = DEPENDENCY_CONTAINER.get<Redis>(TYPESDEPENDENCIES.CacheAdapter);
    async get<T>(key: string): Promise<T | null> {
        try {
            const lista = await this.redis.get(key);
            if(!lista){
                return null
            }
            return JSON.parse(lista);
        } catch (error: any) {
            console.log(error)
            throw new error(error.message);
        }
    }
    async set<T = any>(key:string, data: T): Promise<void> {
        try {
            await this.redis.set(key, JSON.stringify(data));
        } catch (error: any) {
            console.log(error)
            throw new error(error.message);
        }
    }
    async setEx<T = any>(key:string, seconds: number, data: T): Promise<void> {
        try {
            await this.redis.setex(key, seconds, JSON.stringify(data));
        } catch (error: any) {
            console.log(error)
            throw new error(error.message);
        }
    }
    async remove(keys: string[]): Promise<void> {
        try {
            await this.redis.del(...keys);
        } catch (error: any) {
            console.log(error)
            throw new error(error.message);
        }
    }
    async command(command:string, options: string[]): Promise<any> {
        try {
            const results = await this.redis.sendCommand(
                new Command(command, options)
            );
            if(Array.isArray(results)){
                return results.map(x => x.toString())
            }
            if(results instanceof Buffer){
                return results.toString().replaceAll("\r",'').split("\n")
            }
            return results;
        } catch (error: any) {
            console.log(error)
            throw new error(error.message);
        }
    }
}
