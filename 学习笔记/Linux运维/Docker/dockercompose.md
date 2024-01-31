```json
version: '2.2'
services:
    customer-server:
        image: '192.168.99.13:10000/safecloud/test/customer-server' 
        restart: always
        mem_limit: 1g
        ports:
            - '29102:29102'
        volumes:
            - '/usr/share/fonts/chinese/:/usr/share/fonts/chinese/'
            - '/data/docker/safecloud/customer-server/logs/:/src/myapp/logs/'
            - '/data/docker/safecloud/platform-server/opt/image/:/opt/image/'
            - '/data/docker/safecloud/platform-server/opt/file/:/opt/file/'
            - '/data/docker/safecloud/platform-server/opt/temp/:/opt/temp/'
        env_file: ./config.env
        healthcheck:
            test: ["CMD", "curl", "-f", "http://localhost:29102/customer/actuator/health", "||", "exit", "1"]
            interval: 30s
            timeout: 10s 
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    platform-server:
        image: '192.168.99.13:10000/safecloud/test/platform-server'
        restart: always
        mem_limit: 1g
        ports:
            - '29100:29100'
        environment:
            - 'server.port=29100'
        volumes:
            - '/data/docker/safecloud/platform-server/logs/:/usr/src/myapp/logs/'
            - '/data/docker/safecloud/platform-server/opt/image/:/opt/image/'
            - '/data/docker/safecloud/platform-server/opt/file/:/opt/file/'
            - '/data/docker/safecloud/platform-server/opt/temp/:/opt/temp/'
        env_file: ./config.env
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    lpg-server:
        image: '192.168.99.13:10000/safecloud/test/lpg-server'
        restart: always
        mem_limit: 1g
        ports:
            - '29101:29100'
        volumes:
            - '/data/docker/safecloud/lpg-server/logs/:/usr/src/myapp/logs/'
            - '/data/docker/safecloud/platform-server/opt/image/:/opt/image/'
            - '/data/docker/safecloud/platform-server/opt/file/:/opt/file/'
            - '/data/docker/safecloud/platform-server/opt/temp/:/opt/temp/'
        env_file: ./config.env
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    client-server:
        image: '192.168.99.13:10000/safecloud/test/client-server'
        restart: always
        mem_limit: 1g
        ports:
            - '29103:29103'
        volumes:
            - '/data/docker/safecloud/client-server/logs/:/usr/src/myapp/logs/'
            - '/data/docker/safecloud/platform-server/opt/image/:/opt/image/'
            - '/data/docker/safecloud/platform-server/opt/file/:/opt/file/'
            - '/data/docker/safecloud/platform-server/opt/temp/:/opt/temp/'
        env_file: ./config.env
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    stock-server:
        image: '192.168.99.13:10000/safecloud/test/stock-server'
        restart: always
        mem_limit: 1g
        ports:
            - '29104:29104'
        volumes:
            - '/data/docker/safecloud/stock-server/logs/:/usr/src/myapp/logs/'
            - '/data/docker/safecloud/platform-server/opt/image/:/opt/image/'
            - '/data/docker/safecloud/platform-server/opt/file/:/opt/file/'
            - '/data/docker/safecloud/platform-server/opt/temp/:/opt/temp/'
        env_file: ./config.env
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    jtt808-server: 
        image: '192.168.99.13:10000/safecloud/jtt808-server'
        restart: always
        ports:
            - '8000:8000'
            - '7611:7611'
        volumes:
            - '/home/docker/safecloud/jtt808-server/logs/:/usr/src/myapp/logs/'
        env_file: ./config.env
        logging:
            driver: "json-file"
            options:
                max-size: "10m"
                max-file: "10"
    lpg-frontend:
        image: '192.168.99.13:10000/lpg/test/lpg-frontend'
        volumes:
            - '/usr/share/nginx/lpgfrontend/:/frontend/'
    platform-frontend:
        image: '192.168.99.13:10000/safecloud/test/platform-frontend'
        volumes:
            - '/usr/share/nginx/lpgadmin/:/frontend/'

```

