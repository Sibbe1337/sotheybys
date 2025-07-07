FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm@8.15.1

# Install git and other essentials
RUN apt-get update && apt-get install -y \
    git \
    curl \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -s /bin/bash vscode && \
    echo "vscode ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Switch to non-root user
USER vscode

# Set working directory
WORKDIR /workspace

# Copy package files for better caching
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/studio/package.json ./apps/studio/
COPY packages/linear-client/package.json ./packages/linear-client/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Expose ports
EXPOSE 3000 3333

# Default command
CMD ["pnpm", "dev"] 