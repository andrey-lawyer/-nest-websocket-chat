# DataSyncWithSheets

## Next-Leaflet

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Schema](#schema)
- [Running](#running)
- [Deployment](#deployment)

## Introduction

This project is a chat application built using Nest.js and WebSockets. The application allows users to communicate in real-time through chat rooms. The choice of technologies and architecture was driven by several considerations:

- **Next.js Framework:** Chosen for its scalability, simplicity, and built-in support for WebSockets. Nest.js provides a modular structure and integrates seamlessly with various frontend frameworks.

- **WebSocket Protocol:** Utilized for real-time bidirectional communication between clients and the server. WebSockets enable instant messaging without the need for frequent HTTP requests.

- **Socket.IO Library:** Used for WebSocket implementation in Node.js applications. Socket.IO provides robust features for handling connections, rooms, and events, making it ideal for building real-time applications.

- **TypeORM: Employed:** Employed as the Object-Relational Mapping (ORM) tool for database interaction. TypeORM simplifies database operations and supports various database systems, including PostgreSQL and MySQL.

- **PostgreSQL Database:** Chosen for its reliability, performance, and support for complex queries. PostgreSQL stores user data, chat messages, and room information.

- **Axios:** Axios is a popular HTTP client used for making requests to external APIs. It is employed for fetching data in this project.

## Installation

1. **Clone the repo**

```bash
github.com/andrey-lawyer/-nest-websocket-chat
```

2. **Install dependencies** It's recommended to use npm:

```
npm install
```

3. **Create a .env file** in the root directory with the following content:

- POSTGRES_HOST=your_postgres_host
- POSTGRES_PORT_DB=your_postgres_port
- POSTGRES_USER=your_postgres_user
- POSTGRES_PASSWORD=your_postgres_password
- POSTGRES_DB=your_postgres_db
- CLOUD_NAME=your name for cloudinary.com
- CLOUD_API_KEY= your api key for cloudinary.com
- CLOUD_API_SECRET = your api secret for cloudinary.com
- PRIVATE_KEY = your key for Jwt
- API_KEY_AVATAR = your key for multiavatar.com
- CAPTCHA_KEY = your key google recaptcha

## Usage

This project is built using the following technologies:

- **Nest.js:** A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.

- **Express.js:** A lightweight and flexible Node.js web application framework that simplifies the creation of robust APIs.

- **WebSocket Protocol:** A communication protocol that provides full-duplex communication channels over a single TCP connection, allowing for real-time data transfer between clients and servers.

- **Socket.IO:** A JavaScript library for real-time web applications that enables bidirectional communication between clients and servers.

- **PostgreSQL:** The choice of PostgreSQL as the database system is motivated by its advanced features, scalability, and strong support for relational data.

- **TypeORM:** An ORM that simplifies database interactions, providing a convenient way to work with databases using TypeScript.

- **TypeScript:** TypeScript enhances code quality by introducing static typing, catching potential errors during development and improving overall maintainability.

## Schema

The database schema includes tables for Member, Chat, Comment. The relationships between these tables allow for organizing products based on various criteria.

## Running

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deployment

The project is currently deployed on [Render](https://nest-sockets.onrender.com). The database is hosted using the capabilities of [Supabase](https://supabase.com).

Feel free to check the live deployment and interact with the application.

**Docker**
This project supports Docker, making it easy to deploy. To deploy the project, follow these steps:

1. **Install Docker:** If you don't have Docker installed on your computer yet, you can download and install it from the official Docker website.

2. **Get Docker images:** You can get Docker images for this project from Docker Hub:

- For the backend: docker pull andreylawyer/nest-socket
- For the frontend: docker pull andreylawyer/andreyprojects-frontend

3. **Run containers:** Once the images have been successfully obtained, you can run the containers using the following commands:

- For the backend: docker run -d -p 3000:3000 andreylawyer/nest-socket
- For the frontend: docker run -d -p 80:80 andreylawyer/andreyprojects-frontend

4. **Check the project:** After running the containers, you can check the project's functionality by opening its web interface in your browser at the following address:

- For the backend: [docker run -d -p 3000:3000 andreylawyer/nest-socket](http://localhost)
- For the frontend: [docker run -d -p 80:80 andreylawyer/andreyprojects-frontend](http://localhost:3000)
