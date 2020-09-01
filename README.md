## Proyecto Delilah resto

---

### Configuración necesaria

---

1. Ingresar a **http://localhost/phpmyadmin/index.php** o a **https://remotemysql.com**, crear una nueva base de datos, copiar las 7 tablas y los 3 inserts de la carpeta _db_ en orden y pegarlas en la consola de SQL.
2. Crear un archivo .env en el root con los siguientes datos: DB_HOST=localhost, DB_USER=root, JWT_KEY=SuperSecret. Los valores pueden ser modificados dependiendo del usuario, contraseña y host.
3. Realizar la conexión a la base de datos en el archivo _connection.js_ de la carpeta _db_ con la ruta: **mysql://{username}:{password}@{host}:{port}/{database}** (database debe ser el mismo nombre de la base de datos creada en el punto 1)
4. Correr por consola en el editor de código **npm init** para iniciar npm.
5. Ingresar **npm install** para instalar las dependencias.
6. Ingresar **npm start** para iniciar el servidor.

En el archivo _documentation.yaml_ podrás encontrar todos los endpoints disponibles, con ejemplos incluidos.

Para facilitar el testeo, hacer click en el siguiente link:
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/59835ad1ff0174bd287a)
