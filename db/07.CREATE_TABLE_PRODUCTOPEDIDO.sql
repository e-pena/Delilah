CREATE TABLE productoPedido (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    CONSTRAINT FK_pedidoID FOREIGN KEY (pedido_id)
    REFERENCES pedidos (id),
    CONSTRAINT FK_productoID FOREIGN KEY (producto_id)
    REFERENCES productos (id)
)