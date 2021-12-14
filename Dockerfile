FROM node:14-alpine

WORKDIR /app

# Copy the app to the container
COPY dist/ .

# Run the app
CMD ["node", "index.js"]
