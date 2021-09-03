/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { IUser } from '../interfaces/user';
import User from '../modelos/user';
import * as encriptar from '../funciones/encriptar';
import { IResponse } from '../interfaces/response';

export default class UserService {
  async crearUsuario(usuario: IUser, callback: Function) {
    const { salt, passwordHash } = await encriptar.genPassword(usuario.password);
    usuario.password = passwordHash;
    usuario.salt = salt;

    User.create(usuario, (err: any, userDB: any) => {
      if (err) {
        return callback({
          ok: false, mensaje: 'Error al crear usuario', respuesta: err, codigo: 500,
        });
      }

      return callback({
        ok: true, mensaje: 'Usuario creado con exito', respuesta: userDB, codigo: 200,
      });
    });
  }

  async listarUsuarios(callback: Function) {
    const query = User.find({});
    query.select('name email role ');
    await query.exec((err: any, usersDB: any) => {
      if (err) {
        return callback({
          ok: false, mensaje: 'Error al listar usuarios', respuesta: err, codigo: 500,
        });
      }

      if (usersDB.length < 1) {
        return callback({
          ok: true, mensaje: 'No existen usuarios', respuesta: null, codigo: 200,
        });
      }

      return callback({
        ok: true, mensaje: 'usuarios listados con exito', respuesta: usersDB, codigo: 200,
      });
    });
  }

  async loginUsuario(email: string, password: string, callback: Function) {
    const query = User.findOne({ email });
    query.exec(async (err: any, userDB: any) => {
      if (err) {
        return callback({
          ok: false, mensaje: 'Error en base de datos', respuesta: err, codigo: 500,
        });
      }

      if (!userDB) {
        return callback({
          ok: false, mensaje: 'No existe este usuario', respuesta: null, codigo: 404,
        });
      }

      const passwordEncrip = encriptar.sha512(password, userDB.salt);

      if (userDB.password !== passwordEncrip.passwordHash) {
        return callback({
          ok: false, mensaje: 'Datos incorrectos', respuesta: null, codigo: 401,
        });
      }

      const userToken = {
        // eslint-disable-next-line no-underscore-dangle
        id: userDB._id,
        name: userDB.name,
        email: userDB.email,
        role: userDB.role,
      };

      const token = await encriptar.generarToken(userToken)
        .catch((err) => callback({
          ok: false, mensaje: 'Error al generar Token', respuesta: err, codigo: 500,
        }));

      return callback({
        ok: true, mensaje: 'Logueado con exito!', respuesta: token, codigo: 200,
      });
    });
  }

  async seedUsuarios() {
    const query = User.find({});
    query.exec(async (err: any, usersDB: any) => {
      if (err) {
        return err;
      }

      if (usersDB.length < 1) {
        console.log('sembrando usuarios...');
        for (const usuario of this.usuarios) {
          console.log(`creando usuario ${usuario.name}`);
          await this.crearUsuario(usuario, (respuesta: IResponse) => {
            console.log(respuesta.mensaje);
          });
        }
      }
    });
  }

  async checkIfExists(id: string, callback: Function) {
    const query = User.findOne({ _id: id });
    query.select('_id name email role');
    await query.exec((err: any, userDB: any) => {
      if (err) {
        return callback({
          ok: false, mensaje: 'Error en base de datos', respuesta: err, codigo: 500,
        });
      }

      if (!userDB) {
        return callback({
          ok: false, mensaje: 'Usario no encontrado', respuesta: null, codigo: 404,
        });
      }

      return callback({
        ok: true, mensaje: 'Usuario encontrado', respuesta: userDB, codigo: 200,
      });
    });
  }

    usuarios: IUser[] = [
      {
        name: 'admin',
        email: 'admin@edgebound.com',
        password: 'admin',
        role: 'ADMIN',
      },
      {
        name: 'guest',
        email: 'guest@edgebound.com',
        password: 'guest',
        role: 'USER',
      },
    ];
}
