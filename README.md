# 📌 Ruta Óptima - Backend API

## 📍 Descripción
Esta API permite optimizar rutas de entregas en un entorno logístico, asignando dinámicamente envíos a repartidores en función de su ubicación, disponibilidad, condiciones del tráfico y clima, y capacidad de carga de los vehículos. La solución está desarrollada en **Node.js con TypeScript**, siguiendo principios de **Clean Code**, **SOLID** y aplicando técnicas de **optimización de rendimiento**.

## 🚀 Tecnologías Utilizadas
- **Node.js + TypeScript**: Backend escalable y eficiente.
- **Fastify**: Framework ligero y rápido para API RESTful.
- **OR-Tools (Python)**: Para optimización de rutas.
- **Redis (ioredis)**: Cacheo de coordenadas geocodificadas.
- **Google Geocoding API**: Conversión de direcciones a coordenadas.
- **JWT**: Autenticación segura.
- **Jest**: Pruebas unitarias e integración (87% cobertura).

## 📌 Justificación de Elección de Tecnologías
### 🛠️ OR-Tools (Python)
Se decidió utilizar **OR-Tools** debido a que es **gratuito**, ampliamente recomendado por la comunidad y permite ejecutarse como un **servicio independiente**, mejorando tiempos de cálculo en la optimización de rutas.

> **Requerimientos:** Tener Python instalado, OR-Tools configurado y ejecutar `source ortools_env/bin/activate` antes de pruebas como `yarn test`.

### 🗺️ Geocodificación y Manejo de Coordenadas
Para obtener latitud y longitud de las direcciones de envíos, se utiliza **Google Geocoding API** por su precisión.
- Se implementó un **servidor Redis** para cachear coordenadas y reducir solicitudes a la API.
- Las rutas optimizadas se almacenan en **base de datos** para consultas eficientes.

### 🔐 Seguridad y Autenticación
- Implementación de **JWT**.
- El token se genera desde un endpoint y debe pasarse en el **header Bearer** en las solicitudes protegidas.

## 📑 Endpoints Implementados
### 1️⃣ **Generar Token**
- **Método:** GET  
- **URL:** `https://ruta-optima-service-147162009953.us-central1.run.app/rutas/ruta-optima/generar_token`  
- **Descripción:** Devuelve un **token JWT** válido para autenticación.

### 2️⃣ **Calcular Ruta Óptima**
- **Método:** GET  
- **URL:** `https://ruta-optima-service-147162009953.us-central1.run.app/rutas/ruta-optima/calcular_ruta_optima/{id_repartidor}`  
- **Headers:** `Authorization: Bearer <token>`  
- **Descripción:**
  - Obtiene los envíos del repartidor y geocodifica direcciones con Google API.
  - Utiliza **OR-Tools (Python)** para calcular el orden óptimo de entregas.
  - Guarda la ruta optimizada en la base de datos y la retorna al cliente.

### 3️⃣ **Agregar Evento**
- **Método:** POST  
- **URL:** `https://ruta-optima-service-147162009953.us-central1.run.app/rutas/ruta-optima/agregar_evento`  
- **Descripción:** Registra **eventos inesperados** en la ruta del repartidor (ej. congestión, retrasos).

### 4️⃣ **Recalcular Ruta Óptima**
- **Método:** GET  
- **URL:** `https://ruta-optima-service-147162009953.us-central1.run.app/rutas/ruta-optima/calcular_ruta_optima/{id_repartidor}`  
- **Descripción:** Recalcula la ruta en función de eventos registrados previamente.

## 🗂️ Estructura del Proyecto
```
📦 ruta-optima-backend
├── 📂 src
│   ├── 📂 api (Controladores de endpoints)
│   ├── 📂 core (Lógica de negocio y servicios)
│   ├── 📂 domain (Entidades y modelos)
│   ├── 📂 infrastructure (Conexión con BD y Redis)
│   ├── 📂 shared (Utilidades y middlewares)
├── 📄 package.json
├── 📄 README.md
└── 📄 tsconfig.json
```

## ✅ Pruebas Unitarias
Se utilizaron **Jest** y **Supertest** para validaciones automatizadas.
- **Cobertura alcanzada:** 87%
- **Ejecutar pruebas:** `yarn test`

## 📊 Diagramas
### 📌 Diagrama de Base de Datos
_(Adjuntar diagrama ER)_

### 🔄 Diagrama de Flujo
_(Adjuntar diagrama de flujo de la solución)_

## 🎯 Contribuciones
Si deseas contribuir, por favor abre un **Pull Request** o reporta problemas en **Issues**.

## 📝 Licencia
Este proyecto está bajo la licencia **MIT**.

