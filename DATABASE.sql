DROP DATABASE IF EXISTS promocionesdb;

CREATE DATABASE IF NOT EXISTS promocionesdb;

USE promocionesdb;

CREATE TABLE IF NOT EXISTS tbl_usuarios(
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(25) UNIQUE NOT NULL,
    contrasena CHAR(64) NOT NULL,
    permiso ENUM ('SI', 'NO') NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_log(
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    tipo_log VARCHAR(50) NOT NULL,
    fecha DATETIME NOT NULL,
    descripcion VARCHAR(2000) NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_productos(
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    precio_antes INT,
    precio_ahora INT,
    imagen BLOB NOT NULL,
    mostrar BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_promociones(
    id_promocion INT AUTO_INCREMENT PRIMARY KEY,
    id_grupo INT,
    id_producto INT,
    precio INT,
    imagen BLOB NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto)
);