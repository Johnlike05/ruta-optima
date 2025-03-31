CREATE SCHEMA IF NOT EXISTS john_schema;


CREATE TABLE john_schema.cliente (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE john_schema.repartidor (
    id_repartidor SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    disponibilidad VARCHAR(20) NOT NULL,
    matricula VARCHAR(20) NOT NULL,
    capacidad_max NUMERIC NOT NULL,
    latitud_actual NUMERIC,
    longitud_actual NUMERIC,
    direccion_base VARCHAR(100)
);

CREATE TABLE john_schema.ruta (
    id_ruta SERIAL PRIMARY KEY,
    id_repartidor INTEGER REFERENCES repartidor(id_repartidor) ON DELETE SET NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    distancia_total NUMERIC NOT NULL,
    tiempo_estimado INTEGER NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('planificada', 'en_progreso', 'completada', 'cancelada')),
    optimizada BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE john_schema.envio (
    guia VARCHAR(50) PRIMARY KEY,
    direccion_origen TEXT NOT NULL,
    direccion_destino TEXT NOT NULL,
    peso NUMERIC NOT NULL,
    volumen NUMERIC NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'en_ruta', 'entregado', 'cancelado')),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_entrega_estimada TIMESTAMP,
    sla_prioridad VARCHAR(10) NOT NULL,
    id_cliente INTEGER REFERENCES cliente(id_cliente) ON DELETE CASCADE,
    id_repartidor INTEGER REFERENCES repartidor(id_repartidor) ON DELETE SET NULL,
    ciudad_origen VARCHAR(100),
    ciudad_destino VARCHAR(100),
    codigo_ciudad_origen INTEGER,
    codigo_ciudad_destino INTEGER
);

CREATE TABLE john_schema.evento (
    id_evento SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    descripcion TEXT,
    fecha_hora TIMESTAMP NOT NULL DEFAULT NOW(),
    latitud NUMERIC NOT NULL,
    longitud NUMERIC NOT NULL,
    id_ruta INTEGER REFERENCES ruta(id_ruta) ON DELETE CASCADE,
    tiempo_estimado INTEGER,
    id_repartidor INTEGER NOT NULL REFERENCES repartidor(id_repartidor) ON DELETE CASCADE,
    pendiente BOOLEAN DEFAULT TRUE
);
create table john_schema.punto_ruta
(
	id_ruta integer not null,
	orden integer not null,
	latitud numeric(10,9) not null,
	longitud numeric(10,8) not null,
	tiempo_estimado integer not null,
	direccion varchar(200)
);

-- -- Índices para mejorar la búsqueda
-- CREATE INDEX idx_envio_id_cliente ON envio(id_cliente);
-- CREATE INDEX idx_envio_id_repartidor ON envio(id_repartidor);
-- CREATE INDEX idx_evento_id_ruta ON evento(id_ruta);
-- CREATE INDEX idx_evento_id_repartidor ON evento(id_repartidor);
    