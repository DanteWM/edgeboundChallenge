/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
import { Router, Request, Response } from 'express';
import UserService from '../controladoras/user';
import { IResponse } from '../interfaces/response';

const userRoutes = Router();
const userService = new UserService();

userRoutes.post('/crear', async (req: Request, res: Response) => {
  const user = req.body.user;

  await userService.crearUsuario(user, (respuesta: IResponse) => res.status(respuesta.codigo).json(respuesta));
});

userRoutes.post('/login', async (req: Request, res: Response) => {
  const { email } = req.body;
  const { password } = req.body;

  await userService.loginUsuario(email, password, (respuesta: IResponse) => res.status(respuesta.codigo).json(respuesta));
});

userRoutes.get('/listar', async (req: Request, res: Response) => {
  await userService.listarUsuarios((respuesta:IResponse) => res.status(respuesta.codigo).json(respuesta));
});

export default userRoutes;
