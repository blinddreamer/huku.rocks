FROM nginx:alpine
COPY index.html     /usr/share/nginx/html/index.html
COPY style.css      /usr/share/nginx/html/style.css
COPY favicon.ico        /usr/share/nginx/html/favicon.ico
COPY robots.txt          /usr/share/nginx/html/robots.txt
COPY assets/            /usr/share/nginx/html/assets/
EXPOSE 80
