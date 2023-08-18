#!/bin/bash
docker run --name redis -d -p 6379:6379 --restart unless-stopped -v /home/ubuntu/redis/redis.conf:/etc/redis/redis.conf redis redis-server /etc/redis/redis.conf
