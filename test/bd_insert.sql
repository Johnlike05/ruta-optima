
--insert cliente
INSERT INTO john_schema.cliente (id_cliente, nombre, direccion, telefono, email) VALUES (1, 'john', 'cll 71 #113-65', '321518684', 'jhh@gmail.com');

--repartidores
INSERT INTO john_schema.repartidor (id_repartidor, nombre, telefono, disponibilidad, matricula, capacidad_max, latitud_actual, longitud_actual, direccion_base) VALUES (123, 'jairo ayala', '3245657865', 'disponible', 'vdz 567', 2000.00, 4.64009400, -74.12261700, 'Cl. 13 #68D-31');
INSERT INTO john_schema.repartidor (id_repartidor, nombre, telefono, disponibilidad, matricula, capacidad_max, latitud_actual, longitud_actual, direccion_base) VALUES (321, 'jojo puya', '3245678943', 'disponible', 'KHL 234', 1000.00, 4.64009400, -74.12261700, 'Cl. 13 #68D-31');
INSERT INTO john_schema.repartidor (id_repartidor, nombre, telefono, disponibilidad, matricula, capacidad_max, latitud_actual, longitud_actual, direccion_base) VALUES (555, 'carlos puerta', '4345235678', 'disponible', 'Jjl 453', 1000.00, 4.64009400, -74.12261700, 'Cl. 13 #68D-31');
--insert envios
INSERT INTO john_schema.envio (guia, direccion_origen, direccion_destino, peso, volumen, estado, fecha_creacion, fecha_entrega_estimada, sla_prioridad, id_cliente, id_repartidor, ciudad_origen, ciudad_destino, codigo_ciudad_origen, codigo_ciudad_destino) VALUES ('001', 'cll 71 #113-65', 'Av Cl 80 #27-30', 25.00, 130.00, 'pendiente', '2025-03-28 04:47:27.519866', null, '20', 1, 123, 'bogotá', 'bogotá', 1, 1);
INSERT INTO john_schema.envio (guia, direccion_origen, direccion_destino, peso, volumen, estado, fecha_creacion, fecha_entrega_estimada, sla_prioridad, id_cliente, id_repartidor, ciudad_origen, ciudad_destino, codigo_ciudad_origen, codigo_ciudad_destino) VALUES ('002', 'cll 71 #113-65', 'cr 50 #12-34', 18.50, 95.00, 'pendiente', '2025-03-28 06:34:55.573233', null, '15', 1, 123, 'bogotá', 'bogotá', 1, 1);
INSERT INTO john_schema.envio (guia, direccion_origen, direccion_destino, peso, volumen, estado, fecha_creacion, fecha_entrega_estimada, sla_prioridad, id_cliente, id_repartidor, ciudad_origen, ciudad_destino, codigo_ciudad_origen, codigo_ciudad_destino) VALUES ('003', 'cll 71 #113-65', 'av 30 #45-67', 30.00, 200.00, 'pendiente', '2025-03-28 06:34:55.573233', null, '25', 1, 123, 'bogotá', 'bogotá', 1, 1);

INSERT INTO john_schema.envio (guia, direccion_origen, direccion_destino, peso, volumen, estado, fecha_creacion, fecha_entrega_estimada, sla_prioridad, id_cliente, id_repartidor, ciudad_origen, ciudad_destino, codigo_ciudad_origen, codigo_ciudad_destino) VALUES ('013', 'cll 71 #113-65', 'Av Suba #127-90', 22.00, 150.00, 'pendiente', '2025-03-28 04:47:27.519866', null, '20', 1, 321, 'bogotá', 'bogotá', 1, 1);
INSERT INTO john_schema.envio (guia, direccion_origen, direccion_destino, peso, volumen, estado, fecha_creacion, fecha_entrega_estimada, sla_prioridad, id_cliente, id_repartidor, ciudad_origen, ciudad_destino, codigo_ciudad_origen, codigo_ciudad_destino) VALUES ('014', 'cll 71 #113-65', 'Cra 7 #45-78', 10.00, 90.00, 'pendiente', '2025-03-28 04:47:27.519866', null, '20', 1, 321, 'bogotá', 'bogotá', 1, 1);
INSERT INTO john_schema.envio (guia, direccion_origen, direccion_destino, peso, volumen, estado, fecha_creacion, fecha_entrega_estimada, sla_prioridad, id_cliente, id_repartidor, ciudad_origen, ciudad_destino, codigo_ciudad_origen, codigo_ciudad_destino) VALUES ('015', 'cll 71 #113-65', 'Cl 26 #38A-10', 20.00, 135.00, 'pendiente', '2025-03-28 04:47:27.519866', null, '20', 1, 321, 'bogotá', 'bogotá', 1, 1);

INSERT INTO john_schema.envio (guia, direccion_origen, direccion_destino, peso, volumen, estado, fecha_creacion, fecha_entrega_estimada, sla_prioridad, id_cliente, id_repartidor, ciudad_origen, ciudad_destino, codigo_ciudad_origen, codigo_ciudad_destino) VALUES ('017', 'cll 71 #113-65', 'Cl 100 #19-30', 15.00, 110.00, 'pendiente', '2025-03-28 04:47:27.519866', null, '20', 1, 555, 'bogotá', 'bogotá', 1, 1);
INSERT INTO john_schema.envio (guia, direccion_origen, direccion_destino, peso, volumen, estado, fecha_creacion, fecha_entrega_estimada, sla_prioridad, id_cliente, id_repartidor, ciudad_origen, ciudad_destino, codigo_ciudad_origen, codigo_ciudad_destino) VALUES ('018', 'cll 71 #113-65', 'Av Cl 72 #10-34', 18.00, 120.00, 'pendiente', '2025-03-28 04:47:27.519866', null, '20', 1, 555, 'bogotá', 'bogotá', 1, 1);
INSERT INTO john_schema.envio (guia, direccion_origen, direccion_destino, peso, volumen, estado, fecha_creacion, fecha_entrega_estimada, sla_prioridad, id_cliente, id_repartidor, ciudad_origen, ciudad_destino, codigo_ciudad_origen, codigo_ciudad_destino) VALUES ('019', 'cll 71 #113-65', 'Cl 13 #65-45', 20.00, 130.00, 'pendiente', '2025-03-28 04:47:27.519866', null, '20', 1, 555, 'bogotá', 'bogotá', 1, 1);
--insert rutas
INSERT INTO john_schema.ruta (id_ruta, id_repartidor, fecha_creacion, distancia_total, tiempo_estimado, estado, optimizada) VALUES (35, 123, '2025-03-30 03:58:49.944447', 31830.38, 48, 'planificada', false);
INSERT INTO john_schema.ruta (id_ruta, id_repartidor, fecha_creacion, distancia_total, tiempo_estimado, estado, optimizada) VALUES (36, 555, '2025-03-30 17:16:38.536149', 22641.15, 34, 'planificada', false);


--puntos ruta
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 1, 4.640094000, -74.12261700, 0, 'Cl. 13 #68D-31');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 2, 4.634603100, -74.12026880, 1, 'av 68 #11-22 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 3, 4.612167300, -74.11585330, 1, 'cr 50 #12-34 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 4, 4.603956000, -74.06984770, 1, 'av 19 #77-88 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 5, 4.635066900, -74.07931210, 1, 'av 30 #45-67 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 6, 4.645980700, -74.08359110, 1, 'cr 45 #55-66 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 7, 4.669723100, -74.04441440, 1, 'cr 7 #89-10 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 8, 4.681597000, -74.03919700, 1, 'cll 100 #56-78 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 9, 4.670794000, -74.06449510, 1, 'Av Cl 80 #27-30 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 10, 4.675533000, -74.06759600, 1, 'cll 85 #99-00 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 11, 4.681512400, -74.08898330, 1, 'cll 72 #33-44 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (35, 12, 4.640094000, -74.12261700, 0, 'Cl. 13 #68D-31');

INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (36, 1, 4.640094000, -74.12261700, 0, 'Cl. 13 #68D-31');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (36, 2, 4.635093200, -74.11577010, 1, 'Cl 13 #65-45 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (36, 3, 4.619647700, -74.11215410, 1, 'Cra 50 #80-12 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (36, 4, 4.657167700, -74.05751710, 1, 'Av Cl 72 #10-34 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (36, 5, 4.686295700, -74.05227970, 1, 'Cl 100 #19-30 bogotá');
INSERT INTO john_schema.punto_ruta (id_ruta, orden, latitud, longitud, tiempo_estimado, direccion) VALUES (36, 6, 4.640094000, -74.12261700, 0, 'Cl. 13 #68D-31');

--eventos
INSERT INTO john_schema.evento (id_evento, tipo, descripcion, fecha_hora, latitud, longitud, id_ruta, tiempo_estimado, id_repartidor, pendiente) VALUES (5, 'tiempo', 'trancon en la 80', '2025-03-30 22:50:57.383601', 23.21111000, 53.22220000, 36, 28, 555, true);