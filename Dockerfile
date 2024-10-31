# Use the official Node.js image as a base
FROM node:22

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install a lightweight web server to serve the static files
RUN npm install -g serve

# Expose the port that the app runs on
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
