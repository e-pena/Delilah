CREATE TABLE pago (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    forma_pago VARCHAR (255) NOT NULL
)

INSERT INTO pago (`forma_pago`) VALUES ('Efectivo'), ('Tarjeta')