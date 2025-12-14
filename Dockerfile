# https://www.docker.com/blog/how-to-dockerize-react-app/
# Using the node docker image.
FROM node:24-alpine as builder

WORKDIR /app
# Install dependencies
COPY package*.json ./
RUN npm ci && npm cache clean --force
# Move code into container
COPY . .
# Build the app.
RUN npm run build

# Main Stage
FROM node:24-alpine
# Init working directory.
WORKDIR /app
# Install dependencies to main stage.
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
# Copy compiled JavaScript from builder.
COPY --from=builder /app/ ./
# Open up the port. TODO: flexible exposed port.
EXPOSE 5173
# Run Backend.
CMD ["npx", "vite", "--host"]