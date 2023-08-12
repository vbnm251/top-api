FROM node:18-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install --production --force
RUN npm install @nestjs/cli ---force
ADD . .

RUN npm run build
RUN npm prune --production --force
CMD ["npm", "run", "start:prod"]