FROM node:alpine

MAINTAINER Mickey Yawn <mickey.yawn@turner.com>

ENV NPM_CONFIG_LOGLEVEL info

ADD https://github.com/Yelp/dumb-init/releases/download/v1.1.1/dumb-init_1.1.1_amd64 /usr/local/bin/dumb-init
RUN chmod +x /usr/local/bin/dumb-init


ADD package.json package.json

RUN npm install

ADD . .

CMD ["dumb-init", "node","app.js"]

USER node

##### docker run -p 127.0.0.1:8080:3000 [image name here] 
