ARG DATABASE_URL
FROM node:16

ENV DATABASE_URL=$DATABASE_URL
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev

# Bundle app source
COPY . .

# Expose the listening port
EXPOSE 8080

# Start the server
CMD [ "node", "listener.js" ]