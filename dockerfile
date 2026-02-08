# Dockerfile
FROM nginx:alpine

# Copiar arquivos do site para o nginx
COPY . /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]