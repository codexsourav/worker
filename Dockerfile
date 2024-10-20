# Use the official Ubuntu image as a base
FROM ubuntu:20.04

# Set environment variables to avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install curl, unzip, and necessary dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg2 unzip && \
    rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:$PATH"

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and bun.lockb files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 1122

# Command to run your app
CMD ["bun", "start"]
