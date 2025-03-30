import dotenv from 'dotenv';
dotenv.config();
import pgPromise, { IMain, IDatabase } from 'pg-promise';
import { IConnectionParameters } from 'pg-promise/typescript/pg-subset';

const PG_CONECTION: IConnectionParameters = {
    host: process.env.POSTGRES_HOST,
    port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DATABASE,
    connectionTimeoutMillis: 15000,
    max: 15,
    idleTimeoutMillis: 15000,
    query_timeout: 15000,
};


const pgp: IMain = pgPromise();
pgp.pg.types.setTypeParser(pgp.pg.types.builtins.NUMERIC, (value:string) => parseFloat(value));
export const bdRutas = pgp(PG_CONECTION) as IDatabase<IMain>;

