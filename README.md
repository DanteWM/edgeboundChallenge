# EdgeBoundChallenge


### Instalación

1. Clonar
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Instalar paquetes NPM
   ```sh
   npm install
   ```
3. Correr el script `build`
   ```JS
   npm run build';
   ```



## Descripción

El servicio consta de seis rutas ( Listar Usuarios, Crear Usuarios, Login de Usuarios, Crear Orden, Actualizar Orden, Obtener Orden ), en el repositorio se adjunta la colección de postman con ejemplos para realizar las pruebas pertinentes.

Al correr por primera vez el proyecto, se generarán los usuarios admin@edgebound.com con contraseña admin y guest@edgebound.com con contraseña guest, estos son necesarios para generar el token que será colocado en el header 'Authorization', que protege las rutas relacionadas con las órdenes.

Si se desea generar un usuario nuevo, debe tomarse en cuenta que los roles permitidos son "ADMIN" y "USER", es necesario que estos sean escritos con mayúsculas a la hora de hacer el registro.

Los estatus de orden permitidos son "PROCESS", "CANCELLED", "PICKING", "SHIPPING" y "CLOSED", al igual que con usuarios, estos deben ser escritos con mayúsculas.

## Pruebas unitarias

Para ejecutar la pruebas unitarias es necesario generar un token de admin y uno de guest en la ruta "/users/login", deben ir colocados dentro del archivo test/unitarias/helpers.ts en las contantes admiToken y usuarioToken respectivamente.
