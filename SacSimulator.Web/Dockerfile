# Dockerfile para o Front-end

FROM nginx:alpine

# Copiar arquivos estáticos para o diretório do nginx
COPY SacSimulator.Web/ /usr/share/nginx/html/

# Copiar configuração personalizada do nginx
COPY SacSimulator.Web/nginx.conf /etc/nginx/nginx.conf

# Expor porta 80
EXPOSE 80

# Comando padrão do nginx
CMD ["nginx", "-g", "daemon off;"]