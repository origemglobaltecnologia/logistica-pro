# Estágio de Build
FROM node:20-alpine AS build
WORKDIR /app

# Copia dependências e instala
COPY package*.json ./
RUN npm install

# Copia código e realiza o build exportável
COPY . .
RUN npx expo export

# Estágio de Servir
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
