CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    estado_id INT NOT NULL,
    descripcion VARCHAR (255) NOT NULL,
    hora TIME NOT NULL,
    pago_id INT NOT NULL,
    costo INT NOT NULL,
    usuario_id INT NOT NULL,
    CONSTRAINT FK_usuarioPedido FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id),
    CONSTRAINT FK_estadoPedido FOREIGN KEY (estado_id)
    REFERENCES estados (id),
    CONSTRAINT FK_pagoPedido FOREIGN KEY (pago_id)
    REFERENCES pago (id)
)