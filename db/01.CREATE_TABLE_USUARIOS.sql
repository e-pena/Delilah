CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    username VARCHAR (255) NOT NULL,
    nombre_completo VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL,
    direccion VARCHAR (510) NOT NULL,
    telefono VARCHAR (255) NOT NULL,
    contrasenia VARCHAR (255) NOT NULL,
    permisos_id INT UNSIGNED NOT NULL 
)