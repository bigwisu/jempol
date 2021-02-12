FROM node as builder
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli@10.0.0
RUN npm install
RUN ng build --prod --base-href /

FROM nginx:1.18.0-alpine AS buildnginx
ENV NGINX_VERSION 1.18.0
ENV NGINX_COOKIE_FLAG 1.1.0

RUN wget "http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz" -O nginx.tar.gz && \
  wget "https://github.com/AirisX/nginx_cookie_flag_module/archive/v${NGINX_COOKIE_FLAG}.tar.gz" -O nginx_cookie_flag.tar.gz

RUN apk add --no-cache --virtual .build-deps \
                    gcc \
                    libc-dev \
                    make \
                    openssl-dev \
                    pcre-dev \
                    zlib-dev \
                    linux-headers \
                    libxslt-dev \
                    gd-dev \
                    geoip-dev \
                    perl-dev \
                    libedit-dev \
                    mercurial \
                    bash \
                    alpine-sdk \
                    findutils

RUN CONFARGS=$(nginx -V 2>&1 | sed -n -e 's/^.*arguments: //p') \
    mkdir -p /usr/src && \
	tar -zxC /usr/src -f nginx.tar.gz && \
	tar -xzvf "/nginx_cookie_flag.tar.gz" && \
	NGINX_COOKIE_FLAGDIR="/nginx_cookie_flag_module-${NGINX_COOKIE_FLAG}" && \
	cd /usr/src/nginx-$NGINX_VERSION && \
	./configure --with-compat $CONFARGS --add-dynamic-module=$NGINX_COOKIE_FLAGDIR && \
	make && make install

#Serve static files via NGINX
FROM nginx:1.18.0-alpine
COPY --from=buildnginx /usr/local/nginx/modules/ngx_http_cookie_flag_filter_module.so /etc/nginx/modules/ngx_http_cookie_flag_filter_module.so
COPY --from=builder /app/dist/jempol /usr/share/nginx/html
COPY nginx.conf /etc/nginx/
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]