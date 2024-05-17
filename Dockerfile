# Etapa 1: Construcción de la aplicación Angular
FROM node:20 AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el package.json y el package-lock.json (si está presente)
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación Angular
RUN npm run build --prod

# Etapa 2: Servir la aplicación usando un servidor web ligero
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa de construcción
COPY --from=build /app/dist/electrolineras-frontend /usr/share/nginx/html

# Exponer el puerto en el que NGINX servirá la aplicación
EXPOSE 80

# Comando por defecto para ejecutar NGINX
CMD ["nginx", "-g", "daemon off;"]
