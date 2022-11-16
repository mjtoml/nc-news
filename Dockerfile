FROM node:16

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