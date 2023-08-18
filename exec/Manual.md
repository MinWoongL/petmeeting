# Pet Meeting

### 포팅 메뉴얼

#### 목차

- [Pet Meeting](#pet-meeting)
    - [포팅 메뉴얼](#포팅-메뉴얼)
      - [목차](#목차)
      - [개발환경](#개발환경)
      - [환경변수](#환경변수)
      - [DB 구조도](#db-구조도)
      - [빌드](#빌드)
      - [배포](#배포)

#### 개발환경

- IntelliJ IDEA 2023.1.3
- Java 11
- Node.js docker 마다 설정 상이
- AWS EC2 Ubuntu 20.04.3 LTS
- MySQL 8.1.0
- Redis 7.2.0
- Openvidu 2.28.0

#### 환경변수

openvidu: `/opt/openvidu/.env` 참고

__backend__

    DATABASE_URL: jdbc:mysql://i9A203.p.ssafy.io:3306/mydb
    DATABASE_ID: backend
    DATABASE_PASSWORD: Backend@1234
    JWT_SECRET: afd3ad5jf6i23FA89S9DCZ0Xa12sd3qbzxf56Sadvjoupiuy7D5A4F32Zcv14xxvbZ34X32v67QA234d38HG56FbxfDJvcxZFADFzxCV1321
    KAKAO_ADMIN_KEY: bef57d6c185d96c914e88393686973b1

#### DB 구조도

![Pet Meeting ERD](./Pet%20Meeting%20ERD.png)

#### 빌드

1. frontend
   1. `cd develop/frontend/petmeeting/`
   2. `npm install`
   3. `npm run build`
2. backend
   1. `cd springboot/`
   2. `chmod u+x gradlew`
   3. `./gradlew clean bootJar`
3. IoT backend
   1. `cd iot_nodejs/`
   2. `npm install`

#### 배포

아래의 세 파일을 Openvidu가 설치된 디렉토리에 저장

- NGINX custom-nginx.conf
  ```
    # Your App
    upstream yourapp {
        server localhost:5442;
    }

    upstream yourserver {
        server localhost:3000;
    }

    upstream openviduserver {
        server localhost:5443;
    }

    server {
        listen 80;
        listen [::]:80;
        server_name i9a203.p.ssafy.io;

        # Redirect to https
        location / {
            rewrite ^(.*) https://i9a203.p.ssafy.io:443$1 permanent;
        }

        # letsencrypt
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location /nginx_status {
            stub_status;
            allow 127.0.0.1;        #only allow requests from localhost
            deny all;               #deny all other hosts
        }
    }



    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name i9a203.p.ssafy.io;

        # SSL Config
        ssl_certificate         /etc/letsencrypt/live/i9a203.p.ssafy.io/fullchain.pem;
        ssl_certificate_key     /etc/letsencrypt/live/i9a203.p.ssafy.io/privkey.pem;
        ssl_trusted_certificate /etc/letsencrypt/live/i9a203.p.ssafy.io/fullchain.pem;

        ssl_session_cache shared:SSL:50m;
        ssl_session_timeout 5m;
        ssl_stapling on;
        ssl_stapling_verify on;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
        ssl_prefer_server_ciphers off;

        add_header Strict-Transport-Security "max-age=63072000" always;

        # Proxy
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Proto https;
        proxy_headers_hash_bucket_size 512;
        proxy_redirect off;

        #added
            proxy_set_header Connection '';

        # Websockets
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Your App
        location / {
            proxy_pass http://yourapp; # Openvidu call by default
        }

        ########################
        # OpenVidu Locations   #
        ########################
        #################################
        # Common rules CE               #
        #################################
        # Dashboard rule
        location /dashboard {
            allow all;
            deny all;
            proxy_pass http://openviduserver;
        }

        # Websocket rule
        location ~ /openvidu$ {
            proxy_pass http://openviduserver;
        }

        #################################
        # Custom rules                  #
        #################################
        location /spring {
            #rewrite ^/spring(.*)$ $1?$args break;
            proxy_pass http://localhost:5000;
        }

        location /api/ {
            proxy_pass http://yourserver;
            #proxy_pass_request_header on;
                    #proxy_set_header Authorization $http_authorization;
                    #proxy_pass_header Authorization;
        }

        location /backapi {
            rewrite ^/backapi(.*)$ $1?$args break;
            proxy_pass http://localhost:5000;
            #proxy_pass_request_header on;
                    #proxy_set_header Authorization $http_authorization;
                    #proxy_pass_header Authorization;
        }

        #################################
        # New API                       #
        #################################
        location /openvidu/layouts {
            rewrite ^/openvidu/layouts/(.*)$ /custom-layout/$1 break;
            root /opt/openvidu;
        }

        location /openvidu/recordings {
            proxy_pass http://openviduserver;
        }

        location /openvidu/api {
            allow all;
            deny all;
            proxy_pass http://openviduserver;
        }

        location /openvidu/info {
            allow all;
            deny all;
            proxy_pass http://openviduserver;
        }

        location /openvidu/accept-certificate {
            proxy_pass http://openviduserver;
        }

        location /openvidu/cdr {
            allow all;
            deny all;
            proxy_pass http://openviduserver;
        }

        #################################
        # LetsEncrypt                   #
        #################################
        location /.well-known/acme-challenge {
            root /var/www/certbot;
            try_files $uri $uri/ =404;
        }

    }
  ```
- Openvidu docker-compose.yml
  ```
    # ------------------------------------------------------------------------------
    #
    #    DO NOT MODIFY THIS FILE !!!
    #
    #    Configuration properties should be specified in .env file
    #
    #    Application based on OpenVidu should be specified in
    #    docker-compose.override.yml file
    #
    #    This docker-compose file coordinates all services of OpenVidu CE Platform
    #
    #    This file will be overridden when update OpenVidu Platform
    #
    #    Openvidu Version: 2.28.0
    #
    #    Installation Mode: On Premises
    #
    # ------------------------------------------------------------------------------

    version: '3.1'

    services:

        openvidu-server:
            image: openvidu/openvidu-server:2.28.0
            restart: on-failure
            network_mode: host
            entrypoint: ['/usr/local/bin/entrypoint.sh']
            volumes:
                - ./coturn:/run/secrets/coturn
                - /var/run/docker.sock:/var/run/docker.sock
                - ${OPENVIDU_RECORDING_PATH}:${OPENVIDU_RECORDING_PATH}
                - ${OPENVIDU_RECORDING_CUSTOM_LAYOUT}:${OPENVIDU_RECORDING_CUSTOM_LAYOUT}
                - ${OPENVIDU_CDR_PATH}:${OPENVIDU_CDR_PATH}
            env_file:
                - .env
            environment:
                - SERVER_SSL_ENABLED=false
                - SERVER_PORT=5443
                - KMS_URIS=["ws://localhost:8888/kurento"]
                - COTURN_IP=${COTURN_IP:-auto-ipv4}
                - COTURN_PORT=${COTURN_PORT:-3478}
            logging:
                options:
                    max-size: "${DOCKER_LOGS_MAX_SIZE:-100M}"

        kms:
            image: ${KMS_IMAGE:-kurento/kurento-media-server:7.0.1}
            restart: always
            network_mode: host
            ulimits:
            core: -1
            volumes:
                - /opt/openvidu/kms-crashes:/opt/openvidu/kms-crashes
                - ${OPENVIDU_RECORDING_PATH}:${OPENVIDU_RECORDING_PATH}
                - /opt/openvidu/kurento-logs:/opt/openvidu/kurento-logs
            environment:
                - KMS_MIN_PORT=40000
                - KMS_MAX_PORT=57000
                - GST_DEBUG=${KMS_DOCKER_ENV_GST_DEBUG:-}
                - KURENTO_LOG_FILE_SIZE=${KMS_DOCKER_ENV_KURENTO_LOG_FILE_SIZE:-100}
                - KURENTO_LOGS_PATH=/opt/openvidu/kurento-logs
            logging:
                options:
                    max-size: "${DOCKER_LOGS_MAX_SIZE:-100M}"

        coturn:
            image: openvidu/openvidu-coturn:2.28.0
            restart: on-failure
            ports:
                - "${COTURN_PORT:-3478}:${COTURN_PORT:-3478}/tcp"
                - "${COTURN_PORT:-3478}:${COTURN_PORT:-3478}/udp"
            env_file:
                - .env
            volumes:
                - ./coturn:/run/secrets/coturn
            command:
                - --log-file=stdout
                - --listening-port=${COTURN_PORT:-3478}
                - --fingerprint
                - --min-port=${COTURN_MIN_PORT:-57001}
                - --max-port=${COTURN_MAX_PORT:-65535}
                - --realm=openvidu
                - --verbose
                - --use-auth-secret
                - --static-auth-secret=$${COTURN_SHARED_SECRET_KEY}
            logging:
                options:
                    max-size: "${DOCKER_LOGS_MAX_SIZE:-100M}"

        nginx:
            image: openvidu/openvidu-proxy:2.28.0
            restart: always
            network_mode: host
            volumes:
                - ./certificates:/etc/letsencrypt
                - ./owncert:/owncert
                - ./custom-nginx-vhosts:/etc/nginx/vhost.d/
                - ./custom-nginx-locations:/custom-nginx-locations
                - ${OPENVIDU_RECORDING_CUSTOM_LAYOUT}:/opt/openvidu/custom-layout
                - ./custom-nginx.conf:/custom-nginx/custom-nginx.conf
                - ./nginx.conf:/etc/nginx/nginx.conf
            environment:
                - DOMAIN_OR_PUBLIC_IP=${DOMAIN_OR_PUBLIC_IP}
                - CERTIFICATE_TYPE=${CERTIFICATE_TYPE}
                - LETSENCRYPT_EMAIL=${LETSENCRYPT_EMAIL}
                - PROXY_HTTP_PORT=${HTTP_PORT:-}
                - PROXY_HTTPS_PORT=${HTTPS_PORT:-}
                - PROXY_HTTPS_PROTOCOLS=${HTTPS_PROTOCOLS:-}
                - PROXY_HTTPS_CIPHERS=${HTTPS_CIPHERS:-}
                - PROXY_HTTPS_HSTS=${HTTPS_HSTS:-}
                - ALLOWED_ACCESS_TO_DASHBOARD=${ALLOWED_ACCESS_TO_DASHBOARD:-}
                - ALLOWED_ACCESS_TO_RESTAPI=${ALLOWED_ACCESS_TO_RESTAPI:-}
                - PROXY_MODE=CE
                - WITH_APP=true
                - SUPPORT_DEPRECATED_API=${SUPPORT_DEPRECATED_API:-false}
                - REDIRECT_WWW=${REDIRECT_WWW:-false}
                - WORKER_CONNECTIONS=${WORKER_CONNECTIONS:-10240}
                - PUBLIC_IP=${PROXY_PUBLIC_IP:-auto-ipv4}
            logging:
                options:
                    max-size: "${DOCKER_LOGS_MAX_SIZE:-100M}"
  ```
- Openvidu docker-compose.yml
  ```
    version: '3.1'

    services:
        # --------------------------------------------------------------
        #
        #    Change this if your want use your own application.
        #    It's very important expose your application in port 5442
        #    and use the http protocol.
        #
        #    Default Application
        #
        #    Openvidu-Call Version: 2.28.0
        #
        # --------------------------------------------------------------
        app-client:
            image: openvidu/openvidu-react-demo:1.2
            restart: on-failure
            network_mode: host
            environment:
                - SERVER_PORT=3000
                - OPENVIDU_URL=http://i9a203.p.ssafy.io:5443
                - OPENVIDU_SECRET=${OPENVIDU_SECRET}
            logging:
                options:
                    max-size: "${DOCKER_LOGS_MAX_SIZE:-100M}"

  ```