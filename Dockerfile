# Stage 1: Build the React app
FROM node:20-alpine AS build

# Accept build arguments
ARG VITE_SQUARE_APPLICATION_ID
ARG VITE_SQUARE_LOCATION_ID
ARG VITE_API_BASE_URL

# Set them as environment variables for the build
ENV VITE_SQUARE_APPLICATION_ID=$VITE_SQUARE_APPLICATION_ID
ENV VITE_SQUARE_LOCATION_ID=$VITE_SQUARE_LOCATION_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]