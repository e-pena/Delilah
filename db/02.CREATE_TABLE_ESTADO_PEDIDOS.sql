CREATE TABLE estados (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    estado VARCHAR (255) NOT NULL
)

INSERT INTO estados (`estado`) VALUES ('Nuevo'), ('Confirmado'), ('Preparando'), ('Enviando'), ('Cancelado'), ('Entregado')