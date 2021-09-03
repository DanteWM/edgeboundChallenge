import { IOrder } from "../../interfaces/order";
import { IUser } from "../../interfaces/user";

export const user:IUser = {
    name: 'test',
    email: 'test@edgebound.com',
    password: '123456',
    role: 'USER'
}

export const order: IOrder = {
    orderid: '58641937',
    status: 'PROCESS',
    description: 'orden creada desde test',
    timestamp: new Date('2021-09-02T02:43:49.119Z')
}

// Colocar token de admin@edgebound.com generado desde el endpoint /users/login
export const adminToken = '';

// Colocar token de guest@edgebound.com generado desde el endpoint /users/login
export const userToken = '';