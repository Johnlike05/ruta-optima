import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.middlewares();
    this.database();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(bodyParser.json());
    this.express.use(cors());
  }

  private database(): void {
    // Configuración inicial de BD (se implementará luego)
  }

  private routes(): void {
    // Rutas principales (se implementarán luego)
  }
}

export default new App().express;