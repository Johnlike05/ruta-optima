import dotenv from 'dotenv';
import 'module-alias/register';
dotenv.config();
import { application } from './app';
import { createDependencyContainer } from './configuration/DependecyContainer';

const start = async () => {
    const port: number = parseInt(process.env.PORT ?? "8080") || 8080;
    try {
        const server = await application.listen({port: port, host: '0.0.0.0'});
        application.swagger();
        createDependencyContainer();
        console.log(`Application running on ${server}`);
    } catch (error) {
        console.error(error);
        await application.close();
    }
};
start();
