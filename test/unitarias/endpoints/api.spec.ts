import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../index';
import * as helpers from '../helpers';

const api = request(app);

describe('Test peticiones usuario', () => {

    test('Prueba listar usuarios', async () => {
        await api
            .get('/users/listar')
            .expect(200)
    });

    test('Crear usuario', async () => {
        await api
            .post('/users/crear')
            .send({
                user: helpers.user
            })
            .expect(200)
    });

    test('Prueba login', async () => {
        await api
            .post('/users/login')
            .send({
                email: 'admin@edgebound.com',
                password: 'admin'
            })
            .expect(200)
    });
});

describe('Test peticiones ordenes', () => {
    test('Crear orden con un status distinto a PROCESS', async () => {
        helpers.order.status = 'SHIPPING';
        await api
            .post('/orders/crear')
            .set('Authorization', helpers.adminToken)
            .expect(400);
    });

    test('Crear orden', async () => {
        helpers.order.status = 'PROCESS';
        await api
            .post('/orders/crear')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(200);
    });

    test('Mostrar orden', async () => {
        await api
            .get('/orders/obtener/58641937')
            .set('Authorization', helpers.adminToken)
            .expect(200);
    });

    test('Usuario sin privilegios trata de actualizar una orden', async () => {
        await api.put('/orders/actualizar')
            .set('Authorization', helpers.userToken)
            .send({ order: helpers.order })
            .expect(401);
    });

    test('Usuario de solo lectura visualiza orden', async () => {
        await api
            .get('/orders/obtener/58641937')
            .set('Authorization', helpers.userToken)
            .expect(200);
    });

    test('Actualización de status con flujo incorrecto PROCESS - SHIPPING - CLOSED', async () => {
        helpers.order.status = 'SHIPPING';

        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send(
                {
                    order: helpers.order
                }
            )
            .expect(400)

        helpers.order.status = 'CLOSED'
        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send(
                {
                    order: helpers.order
                }
            )
            .expect(400)
    });

    test('Actualización de status con hora adelantada', async () => {
        let horaActual = new Date(Date.now()).getTime();
        let horaAdelantada = new Date(horaActual + 6000);

        helpers.order.timestamp = horaAdelantada;

        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(400);
    });

    test('Actualización de status PROCESS - PICKING', async () => {
        helpers.order.status = 'PICKING';
        helpers.order.timestamp = new Date('2021-09-02T02:43:49.119Z');

        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(200)
    });

    test('Actualizacion de status con flujo incorrecto PICKING - CLOSED - PROCESS - CANCELLED', async () => {
        helpers.order.status = 'CLOSED';
        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(400)

        helpers.order.status = 'PROCESS';
        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(400)

        helpers.order.status = 'CANCELLED';
        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(400)
    });

    test('Actualización de status PICKING - SHIPPING sin url ni codigo de rastreo', async () => {
        helpers.order.status = 'SHIPPING';
        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(400)
    });

    test('Actualización de status PICKIN - SHIPPING correcta', async () => {
        helpers.order.trackingUrls = [];
        helpers.order.trackingCodes = [];
        helpers.order.trackingUrls.push('https://www.dhl.com/tracking/?guia=1234');
        helpers.order.trackingCodes.push('1234');
        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(200);
    });

    test('Actualización de status con flujo incorrecto SHIPPING - PICKING - PROCESS - CANCELLED', async () => {
        helpers.order.status = 'PICKING';

        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(400);

        helpers.order.status = 'PROCESS';
        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(400);

        helpers.order.status = 'CANCELLED';
        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(400);
    });

    test('Actualización de status SHIPPING - CLOSED', async () => {
        helpers.order.status = 'CLOSED';
        await api
            .put('/orders/actualizar')
            .set('Authorization', helpers.adminToken)
            .send({ order: helpers.order })
            .expect(200)
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    await app.listen().close();
});
