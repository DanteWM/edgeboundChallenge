/* eslint-disable prefer-destructuring */
import express from 'express';
import cors from 'cors';
import ServerHttp from './clases/server';

// Importación de rutas
import orderRoutes from './rutas/order';
import userRoutes from './rutas/user';

const server = ServerHttp.instance;

server.app.enable('trust proxy');

server.app.use(express.urlencoded({ extended: true }));
server.app.use(express.json());

server.app.use(cors({ origin: '*', credentials: true }));

// Seteo de rutas
server.app.use('/orders', orderRoutes);
server.app.use('/users', userRoutes);

server.iniciar();

const app = server.app;

export default app;
