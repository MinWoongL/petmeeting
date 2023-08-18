#!/bin/bash
docker run --name mysql -v /home/ubuntu/mysql/docker-volume:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=dptmzbdpf33241 -d -p 3306:3306 --restart unless-stopped mysql
