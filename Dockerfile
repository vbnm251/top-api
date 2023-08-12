FROM node:18-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install --production --legacy-peer-deps
ADD . .

RUN npm run build
CMD ["npm", "run", "start:prod"]