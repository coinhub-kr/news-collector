FROM node:16-alpine

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apk add chromium
# 디렉토리 만듦
WORKDIR /usr/src/app

# 의존성 파일 복사
COPY ./package*.json ./

# 의존성 설치
RUN npm install

COPY ./conf .
COPY ./env .
COPY ./parser .
COPY ./server .
COPY ./topic-channel .
COPY ./index.js .

ENTRYPOINT ["node", "./index.js"]