# 가져올 이미지를 정의
FROM node:14
# 경로 설정하기
WORKDIR /app

COPY package.json .
# COPY .env .
# 명령어 실행 (의존성 설치)
RUN npm install
COPY . .
# 각각의 명령어들은 한줄 한줄씩 캐싱되어 실행된다.
# package.json의 내용은 자주 바뀌진 않을 거지만
# 소스 코드는 자주 바뀌는데
# npm install과 COPY . . 를 동시에 수행하면
# 소스 코드가 조금 달라질때도 항상 npm install을 수행해서 리소스가 낭비된다.
# 3차 수정용 주석
# 3010번 포트 노출
EXPOSE 3010

# npm start 스크립트 실행
CMD ["node", "index.js"]
