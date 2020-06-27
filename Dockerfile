FROM node as builder
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm install
RUN ng build --base-href /

#Serve static files via NGINX
FROM nginx:alpine
COPY --from=builder /app/dist/jempol /usr/share/nginx/html
COPY nginx.conf /etc/nginx/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]