--Crear base de datos 

CREATE DATABASE parqueadero;

--Tablas de las base de datos 

CREATE TABLE Roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT REFERENCES Roles(id)
);

CREATE TABLE Parqueaderos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    capacidad INT NOT NULL,
    costo_hora DECIMAL(10, 2) NOT NULL,
    socio_id INT REFERENCES Usuarios(id)
);

CREATE TABLE Vehiculos (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(6) UNIQUE NOT NULL
);

CREATE TABLE HistorialVehiculos (
    id SERIAL PRIMARY KEY,
    vehiculo_id INT REFERENCES Vehiculos(id),
    parqueadero_id INT REFERENCES Parqueaderos(id),
    fecha_ingreso TIMESTAMP NOT NULL,
    fecha_salida TIMESTAMP,
    pago DECIMAL(10, 2) DEFAULT 0
);

CREATE TABLE IngresosVehiculos (
    id SERIAL PRIMARY KEY,
    vehiculo_id INT REFERENCES Vehiculos(id),
    parqueadero_id INT REFERENCES Parqueaderos(id),
    fecha_ingreso TIMESTAMP NOT NULL,
    fecha_salida TIMESTAMP,
);


CREATE TABLE EntradasParqueadero (
    id SERIAL PRIMARY KEY,
    vehiculo_id INT REFERENCES Vehiculos(id),
    parqueadero_id INT REFERENCES Parqueaderos(id),
    cantidad_entradas INT DEFAULT 0,
    UNIQUE (parqueadero_id, vehiculo_id)
);

CREATE TABLE EntradasVehiculo (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(20) UNIQUE,
    cantidad_entradas INT DEFAULT 0
);

--Registras los roles 

INSERT INTO Roles (name) VALUES ('ADMIN'), ('SOCIO') ON CONFLICT (name) DO NOTHING;