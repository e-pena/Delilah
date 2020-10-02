CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    nombre_completo VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL UNIQUE,
    direccion VARCHAR (255) NOT NULL,
    telefono VARCHAR (255) NOT NULL,
    contrasenia VARCHAR (255) NOT NULL,
    permisos_id INT NOT NULL, 
    CONSTRAINT FK_permisosUsuario FOREIGN KEY (permisos_id)
    REFERENCES permisos(id)
)