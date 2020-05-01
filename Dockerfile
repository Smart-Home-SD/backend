FROM node:10-alpine

ADD package.json /tmp/package.json
RUN cd /tmp && npm install

RUN mkdir -p /opt/trabsd && cp -a /tmp/node_modules /opt/trabsd

WORKDIR /opt/trabsd
COPY . /opt/trabsd

EXPOSE 3698

CMD [ "npm", "start" ]
