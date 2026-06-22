FROM node

# Create app directory
WORKDIR /app

# Install app dependencies (use package-lock if present)
COPY package*.json ./
RUN npm install --production || true

# Bundle app source
COPY . ./

EXPOSE 3000

CMD ["node", "index.js"]