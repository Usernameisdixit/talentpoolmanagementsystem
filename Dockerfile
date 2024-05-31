FROM node:20.11.0-alpine As build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 



FROM nginx
COPY --from=build /app/dist/tpms /usr/share/nginx/html/tpms
EXPOSE 80
