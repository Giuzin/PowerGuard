FROM node:20

WORKDIR /usr/src/powerguard

COPY . /usr/src/powerguard/

RUN npm install -g http-server

ENTRYPOINT [ "http-server" ]
CMD [ "-p", "80" ]