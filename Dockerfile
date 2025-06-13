# Build stage
FROM node:22-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install all workspace dependencies from root
RUN yarn install

# Build app
RUN yarn build:common
RUN yarn build:cctp-sdk
RUN yarn build:back-end

# Production stage
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Copy built application and dependencies from builder
COPY --from=builder /app/apps/back-end/dist ./apps/back-end/dist
COPY --from=builder /app/apps/back-end/package.json ./apps/back-end/package.json
COPY --from=builder /app/apps/back-end/node_modules ./apps/back-end/node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/packages/common ./packages/common
COPY --from=builder /app/packages/cctp-sdk/ ./packages/cctp-sdk

# Create non-root user for security
RUN addgroup -g 1001 -S stable && \
    adduser -S stable -u 1001 && \
    chown -R stable:stable /app

# Switch to non-root user
USER stable

# Set environment variables
ARG PORT=3000
ENV PORT=${PORT}
ENV NODE_ENV=production

# Expose port
EXPOSE ${PORT}

# Start the production server
CMD ["node", "./apps/back-end/dist/main.js"]
