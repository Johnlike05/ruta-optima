# Usa una imagen oficial de Node.js con una base ligera
FROM node:20-slim

# Instala Python y pip
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv

# Crea y activa un entorno virtual para Python
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Instala OR-Tools dentro del entorno virtual
RUN pip install ortools

# Crea un directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de package.json y yarn.lock para instalar las dependencias
COPY package.json yarn.lock ./

# Instala las dependencias (tanto de desarrollo como de producción)
RUN yarn install --production=false

# Copia todo el código fuente del proyecto
COPY . .

# Compila el proyecto TypeScript
RUN yarn build

# Verifica que el archivo dist/index.js se haya generado correctamente
RUN ls -la ./dist/

# Expone el puerto 8080 que es el puerto por defecto que usa Cloud Run
EXPOSE 8080

# Cambia al usuario no root
USER node

# Ejecuta la aplicación usando Node.js con el registro de los alias de módulos
CMD ["yarn", "start"]
