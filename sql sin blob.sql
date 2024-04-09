-- DATABASE SIN BLOB IMAGE
DROP TABLE IF EXISTS tbl_usuarios;
DROP TABLE IF EXISTS tbl_log;
DROP TABLE IF EXISTS tbl_promociones;
DROP TABLE IF EXISTS tbl_productos;


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
    imagen VARCHAR(300) NOT NULL,
    tiempo INT NOT NULL,
    mostrar BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS tbl_promociones(
    id_promocion INT AUTO_INCREMENT PRIMARY KEY,
    id_grupo INT,
    id_producto INT,
    precio INT,
    imagen VARCHAR(300) NOT NULL,
    tiempo INT NOT NULL,
    mostrar BOOLEAN NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto)
);

INSERT INTO tbl_usuarios(usuario, contrasena, permiso) VALUES ("franco", "$2b$10$bjVoR2FpMdGi8IIiDlkoRurWhfUIebkrVRan8Oa9YX4nNizFLsQ6S", "SI");

INSERT INTO tbl_productos(descripcion, precio_antes, precio_ahora, imagen, mostrar, tiempo) VALUES ("Producto sin blob 1", 5800, 5400, "https://i.pinimg.com/originals/fe/9c/6b/fe9c6be5759c12298688b2dd97cd5fd1.jpg", 1, 5000);
INSERT INTO tbl_productos(descripcion, precio_antes, precio_ahora, imagen, mostrar, tiempo) VALUES ("Producto sin blob 2", 4800, 4400, "https://i.pinimg.com/originals/8e/51/30/8e51302d51089d0f234dc16314c4e5b6.jpg", 1, 5000);
INSERT INTO tbl_productos(descripcion, precio_antes, precio_ahora, imagen, mostrar, tiempo) VALUES ("Producto sin blob 3", 3890, 4590, "https://www.alpine.es/fileadmin/images/MediaCenter/Wallpaper/Alpine_Golf-7_1920x1080.jpg", 1, 5000);


INSERT INTO tbl_promociones(id_grupo, id_producto, precio, imagen, mostrar, tiempo) VALUES (1, 1, 10000, "https://images.wallpapersden.com/image/download/purple-sunrise-4k-vaporwave_bGplZmiUmZqaraWkpJRmbmdlrWZlbWU.jpg", 1, 5000);
INSERT INTO tbl_promociones(id_grupo, id_producto, precio, imagen, mostrar, tiempo) VALUES (1, 2, 10000, "https://images.wallpapersden.com/image/download/purple-sunrise-4k-vaporwave_bGplZmiUmZqaraWkpJRmbmdlrWZlbWU.jpg", 1, 5000);
INSERT INTO tbl_promociones(id_grupo, id_producto, precio, imagen, mostrar, tiempo) VALUES (2, 3, 3590, "https://i.pinimg.com/originals/49/48/72/494872adcf51b55e610b7d3d13e50fdc.jpg", 1, 5000);


select * from tbl_productos;
select * from tbl_log;
select * from tbl_usuarios;
select * from tbl_promociones;