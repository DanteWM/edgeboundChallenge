/* eslint-disable no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import moment from 'moment-timezone';
import { IOrder } from '../interfaces/order';
import Order from '../modelos/order';

export default class OrderService {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}

  async crearOrder(order: IOrder, callback: Function) {
    const horaServer = moment.tz(new Date(), 'America/mexico_city').unix();
    const horaOrder = moment(new Date(order.timestamp.valueOf().toString().substr(0, 19))).unix();

    const existsOrder = await this.checkIfExists(order.orderid)
      .catch((err) => callback({
        ok: false, mensaje: 'Error en base de datos', respuesta: err, codigo: 500,
      }));

    if (existsOrder) {
      return callback({
        ok: false, mensaje: `La orden con id ${order.orderid} ya existe`, respuesta: null, codigo: 400,
      });
    }

    if (order.status !== 'PROCESS') {
      return callback({
        ok: false, mensaje: 'El status inicial debe ser PROCESS', respuesta: null, codigo: 400,
      });
    }

    if (horaOrder > horaServer) {
      return callback({
        ok: false, mensaje: 'Error en la hora de la orden', respuesta: null, codigo: 400,
      });
    }

    if (order.trackingCodes || order.trackingUrls) {
      delete (order.trackingCodes);
      delete (order.trackingUrls);
    }

    await Order.create(order, (err: any, orderDB: any) => {
      if (err) {
        return callback({
          ok: false, mensaje: 'Error al crear la orden', respuesta: err, codigo: 500,
        });
      }

      return callback({
        ok: true, mensaje: 'Orden creada con exito!', respuesta: orderDB, codigo: 200,
      });
    });
  }

  async mostrarOrder(idOrder: string, callback:Function) {
    const query = Order.findOne({ orderid: idOrder });
    await query.exec((err: any, orderDB: any) => {
      if (err) {
        return callback({
          ok: false, mensaje: 'Error al recuperar orden', respuesta: err, codigo: 500,
        });
      }

      if (!orderDB) {
        return callback({
          ok: false, mensaje: 'No existe una orden con estos criterios', respuesta: null, codigo: 400,
        });
      }

      return callback({
        ok: true, mensaje: 'Orden encontrada!', respuesta: orderDB, codigo: 200,
      });
    });
  }

  async actualizarOrder(order: IOrder, callback: Function) {
    const horaServer = moment.tz(new Date(), 'America/mexico_city').unix();
    const horaOrder = moment(new Date(order.timestamp.valueOf().toString().substr(0, 19))).unix();

    if (order.status === 'SHIPPING') {
      if (!order.trackingUrls || order.trackingUrls.length < 1 || order.trackingUrls == null) {
        return callback({
          ok: false, mensaje: 'Debes enviar una url de rastreo', respuesta: null, codigo: 400,
        });
      }

      if (!order.trackingCodes || order.trackingCodes.length < 1 || order.trackingCodes == null) {
        return callback({
          ok: false, mensaje: 'Debes enviar el codigo de rastreo', respuesta: null, codigo: 400,
        });
      }
    }

    if (horaOrder > horaServer) {
      return callback({
        ok: false, mensaje: 'Error en la hora', respuesta: null, codigo: 400,
      });
    }

    const query = Order.findOne({ orderid: order.orderid });
    query.exec(async (err: any, orderDB: any) => {
      if (err) {
        return callback({
          ok: false, mensaje: 'Error al buscar orden', respuesta: err, codigo: 500,
        });
      }

      if (!orderDB) {
        return callback({
          ok: false, mensaje: 'No existe una orden con estos criterios', respuesta: null, codigo: 404,
        });
      }

      switch (orderDB.status) {
        case 'PROCESS':
          if (order.status !== 'PICKING') {
            if (order.status !== 'CANCELLED') {
              return callback({
                ok: false, mensaje: 'Error al actualizar status', respuesta: null, codigo: 400,
              });
            }
          }
          break;
        case 'PICKING':
          if (order.status !== 'SHIPPING') {
            return callback({
              ok: false, mensaje: 'Error al actualizar status', respuesta: null, codigo: 400,
            });
          }
          break;
        case 'SHIPPING':
          if (order.status !== 'CLOSED') {
            return callback({
              ok: false, mensaje: 'Error al actualizar status', respuesta: null, codigo: 400,
            });
          }
          break;

        default:
          return callback({
            ok: false, mensaje: 'Error al actualizar status', repuesta: null, codigo: 400,
          });
      }

      if (order.status === 'SHIPPING') {
        orderDB.trackingUrls = order.trackingUrls;
        orderDB.trackingCodes = order.trackingCodes;
      }

      orderDB.status = order.status;
      orderDB.timestamp = order.timestamp;
      orderDB.description = order.description;

      // eslint-disable-next-line no-shadow
      await orderDB.save((err: any, orderUp: any) => {
        if (err) {
          return callback({
            ok: false, mensaje: 'Error al actualizar orden', respuesta: err, codigo: 500,
          });
        }

        return callback({
          ok: true, mensaje: 'La orden actualizada con exito!', respuesta: orderUp, codigo: 200,
        });
      });
    });
  }

  async checkIfExists(idOrder: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = Order.findOne({ orderid: idOrder });
      query.exec((err: any, orderDB: any) => {
        if (err) {
          return reject(err);
        }

        if (!orderDB) {
          return resolve(false);
        }

        return resolve(true);
      });
    });
  }
}
