CREATE TABLE permisos (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    permisos VARCHAR (255) NOT NULL
)

INSERT INTO permisos (`permisos`) VALUES ('Usuario'), ('Admin')