## Proyecto Delilah resto

---

### Configuración necesaria

---

1. Ingresar a **http://localhost/phpmyadmin/index.php** o a **https://remotemysql.com**, crear una nueva base de datos, copiar las 7 tablas de la carpeta _db_ en orden y pegarlas en la consola de SQL.
2. Realizar la conexión a la base de datos en el archivo _connection.js_ de la carpeta _db_ con la ruta: **mysql://{username}:{password}@{host}:{port}/{database}** (database debe ser el mismo nombre de la base de datos creada en el punto 1)
3. Correr por consola en el editor de código **npm init** para iniciar npm.
4. Ingresar **npm install** para instalar las dependencias.
5. Ingresar **npm start** para iniciar el servidor.

En el archivo _documentation.yaml_ podrás encontrar todos los endpoints disponibles, con ejemplos incluidos.

Para facilitar el testeo, hacer click en el siguiente link:
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/057604fe2043313ff7af)
