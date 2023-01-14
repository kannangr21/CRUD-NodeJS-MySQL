# PERSON DETAILS CRUD APPLICATION

This repository contains the source code for the CRUD application with MySQL Database and NodeJS environment Express Framework.

## Getting Started

- Prerequisites are NodeJS and npm installed globally in the machine
- Clone this repo
- `npm i` to install all required dependencies
- Download [MySQL](https://www.mysql.com/downloads/) and setup a database.
- Configure `.env` file for environment variables
- `npm run start` to start the application

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [dotenv](https://www.npmjs.com/package/dotenv) - Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env
- [mysql](https://www.npmjs.com/package/mysql) - This is a node.js driver for mysql.

## Application Structure

- `app.js` - The entry point to our application. This file defines our express server and calls the function that connects to the database. It also requires the routes we'll be using in the application.
- `config.js` - This file contains the configuration of the server like database cerdentials.
- `services/` - The folder contains the services that are required for this server. Database connection has been defined inside this folder.
- `person/` - This folder contains the person/ routes and the function definitions of this API
- `.env` - The file to set environment variables.
