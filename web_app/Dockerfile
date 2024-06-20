# Stage 1: Build the React Application
FROM node:18 as build
WORKDIR /app


COPY ./package*.json /app
RUN npm install
RUN npm install axios
RUN npm install dotenv
COPY ./public /app/public
COPY ./src /app/src
ARG REACT_APP_GPT
ENV REACT_APP_GPT=${REACT_APP_GPT}

# install dependencies
RUN npm run build

# Stage 2: Setup the Nginx Server to serve the React Application
FROM nginx:1.25.0-alpine as production
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8070
CMD ["nginx", "-g", "daemon off;"]