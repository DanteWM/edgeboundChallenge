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
export const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzE5ZTFlZDMyODcwNzQzOTRhNjkwMSIsIm5hbWUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZWRnZWJvdW5kLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYzMDY4ODg0OCwiZXhwIjoxNjMzMjgwODQ4fQ.xbIqmXNpMCTlisrRsaZB9YY7l_bXhocj8vqXhmnL4EI';

// Colocar token de guest@edgebound.com generado desde el endpoint /users/login
export const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzE5ZTFlZDMyODcwNzQzOTRhNjkwMiIsIm5hbWUiOiJndWVzdCIsImVtYWlsIjoiZ3Vlc3RAZWRnZWJvdW5kLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjMwNjg4ODIwLCJleHAiOjE2MzMyODA4MjB9.snMOFk3W-I2iSRomvBm1af8VZFeXTTtQDlu68uGzaNg';