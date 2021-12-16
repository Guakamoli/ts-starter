FROM node:14-alpine as base

# Create the app directory
WORKDIR /app

FROM base as deps

# Copy the app files
COPY --chown=node:node package.json pnpm-lock.yaml ./

# Install dependencies (no devDependencies)
RUN npm i -g pnpm && pnpm install --only=prod

FROM base as gen

# Copy the app files
COPY --chown=node:node . .

# Install dependencies
RUN npm i -g pnpm \
  && pnpm install \
  && pnpm run build

FROM base as runner

RUN chown node:node .
USER node

# Copy the app to the container
COPY --chown=node:node --from=deps /app/package.json ./
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node --from=gen /app/dist ./dist

# 创建一个占位文件
RUN touch .env

EXPOSE 8080

# Run the app
CMD ["node", "."]
