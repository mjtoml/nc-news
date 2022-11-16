ARG DATABASE_URL
FROM node:16

ENV NODE_ENV=production
ENV DATABASE_URL=$DATABASE_URL

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose the listening port
EXPOSE 8080

# Start the server
CMD [ "npm", "run", "start" ]