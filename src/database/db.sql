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
    fecha_salida TIMESTAMP NOT NULL
);

CREATE TABLE IngresosVehiculos (
    id SERIAL PRIMARY KEY,
    vehiculo_id INT REFERENCES Vehiculos(id),
    parqueadero_id INT REFERENCES Parqueaderos(id),
    fecha_ingreso TIMESTAMP NOT NULL
);

CREATE TABLE EmailsEnviados (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    placa VARCHAR(6) NOT NULL,
    mensaje TEXT NOT NULL,
    parqueadero_nombre VARCHAR(255) NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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