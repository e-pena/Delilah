CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    estado_id VARCHAR (255) NOT NULL,
    descripcion VARCHAR (510) NOT NULL,
    hora TIME NOT NULL,
    pago_id INT NOT NULL,
    costo INT NOT NULL,
    usuario_id INT NOT NULL     
)