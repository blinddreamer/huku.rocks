FROM nginx:alpine
COPY index.html     /usr/share/nginx/html/index.html
COPY style.css      /usr/share/nginx/html/style.css
COPY public/favicon.ico /usr/share/nginx/html/favicon.ico
EXPOSE 80
