FROM node:carbon-alpine
WORKDIR /www 
COPY . /www
VOLUME ./:/www
RUN npm install
CMD npm run build && npm start
