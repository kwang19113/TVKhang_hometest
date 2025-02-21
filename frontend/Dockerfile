# Use the official Node.js image as a base
FROM node:20

# Set the working directory
WORKDIR /app

# Accept a build argument for the API URL
ARG NEXT_PUBLIC_API_URL
# Set the environment variable using the build argument.
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
