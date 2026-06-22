FROM node

WORKDIR /app

COPY . .

RUN node index.js

CMD ["node", "index.js"]