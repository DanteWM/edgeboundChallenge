import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import * as environment from '../config/environment';

export function genRandomString(length: number) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

export function getStringValue(datos: any) {
  if (typeof datos === 'number' || datos instanceof Number) {
    return String(datos);
  }

  if (!Buffer.isBuffer(datos) && typeof datos !== 'string') {
    throw new TypeError('Los datos para generar contraseñas deben ser de tipo String o Buffer');
  }

  return datos;
}

export function sha512(password: string, salt: string) {
  const hash = crypto.createHmac('sha512', getStringValue(salt));
  hash.update(getStringValue(password));
  const passwordHash = hash.digest('hex');

  return {
    salt,
    passwordHash,
  };
}

export async function genPassword(password: string) {
  const salt = genRandomString(16);
  return sha512(String(password), salt);
}

export function generarToken(usuario: any): Promise<any> {
  return new Promise((tokenUs, error) => {
    jwt.sign(usuario, environment.JwtTokenSecret, {
      expiresIn: environment.JwtTokenLife,
    }, (err, token) => {
      if (err) {
        return error(err);
      }
      return tokenUs(token);
    });
  });
}

export function suma(a: number, b: number) {
  return a + b;
}
