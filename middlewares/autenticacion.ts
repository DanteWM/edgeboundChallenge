/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JwtTokenSecret } from '../config/environment';
import UserService from '../controladoras/user';
import { IResponse } from '../interfaces/response';

const userService = new UserService();

export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token: any = req.headers.authorization;

  verify(token, JwtTokenSecret, async (err: any, decodificado: any) => {
    if (err) {
      return res.status(401).json({ ok: false, mensaje: 'Existe un problema con el token', err });
    }

    await userService.checkIfExists(decodificado.id, (respuesta: IResponse) => {
      if (respuesta.ok) {
        req.body.user = decodificado;
        next();
      } else {
        return res.status(respuesta.codigo).json(respuesta);
      }
    });
  });
}
