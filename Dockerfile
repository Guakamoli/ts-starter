FROM node:14-alpine as base

# Create the app directory
WORKDIR /app

# Allow yarn/npm to create ./node_modules
RUN chown node:node .
USER node

FROM base as deps

# Copy the app files
COPY --chown=node:node . .

# Install dependencies
RUN npm install

FROM base as runner

# Copy the app to the container
COPY --chown=node:node --from=deps /app/node_modules/ /app/package.json ./

# Run the app
CMD ["npm", "start"]
