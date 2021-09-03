/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
import { Router, Request, Response } from 'express';
import OrderService from '../controladoras/order';
import { IResponse } from '../interfaces/response';
import { verifyToken } from '../middlewares/autenticacion';

const orderRoutes = Router();
const orderService = new OrderService();

orderRoutes.get('/obtener/:idOrder', verifyToken, async (req: Request, res: Response) => {
  const { idOrder } = req.params;

  if (!idOrder) {
    return res.status(400).json({
      ok: false, mensaje: 'No ingresaste un número de orden', respuesta: null, codigo: 400,
    });
  }

  await orderService.mostrarOrder(idOrder, (respuesta: IResponse) => res.status(respuesta.codigo).json(respuesta));
});

orderRoutes.post('/crear', verifyToken, async (req: Request, res: Response) => {
  const user = req.body.user;
  const order = req.body.order;

  if (user.role !== 'ADMIN') {
    return res.status(401).json({
      ok: false, mensaje: 'No tienes permisos para crear ordenes', respuesta: null, codigo: 401,
    });
  }

  if (!order) {
    return res.status(400).json({
      ok: false, mensaje: 'Ocurrio un error al crear la orden', respuesta: null, codigo: 400,
    });
  }

  await orderService.crearOrder(order, (respuesta: IResponse) => res.status(respuesta.codigo).json(respuesta));
});

orderRoutes.put('/actualizar', verifyToken, async (req: Request, res: Response) => {
  const { user } = req.body;
  const { order } = req.body;

  if (user.role !== 'ADMIN') {
    return res.status(401).json({
      ok: false, mensaje: 'No tienes permisos para actualizar ordenes', respuesta: null, codigo: 401,
    });
  }

  await orderService.actualizarOrder(order, (respuesta: IResponse) => res.status(respuesta.codigo).json(respuesta));
});

export default orderRoutes;
