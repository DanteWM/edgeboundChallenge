/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from 'express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { DbName, DbUrl } from '../config/environment';
import UserService from '../controladoras/user';

const userService = new UserService();

export default class ServerHttp {
    private static instancia: ServerHttp;

    public app: express.Application;

    public port: number;

    private httpServer: any;

    private constructor() {
      this.app = express();
      this.port = 5005;

      this.httpServer = createServer(this.app);
    }

    public static get instance() {
      const instancia = this.instancia || (this.instancia = new this());
      return instancia;
    }

    async iniciar() {
      mongoose.connect(DbUrl, {}, (err) => {
        if (err) { throw err; }
        console.log(`Conectado a la base de datos ${DbName}`);
        this.httpServer.listen(this.port, async () => {
          console.log(`Servidor corriendo en el puerto: ${this.port}`);
        });
      });

      await userService.seedUsuarios();
    }
}
