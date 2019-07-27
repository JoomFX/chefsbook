# RECIPE NUTRITION CALCULATOR API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Final Project Assignment for Telerik Academy Aplpha with JavaScript - Design and implement single-page web application that will allow restaurant chefs to create and manage recipes composed of products with known nutrition values. During the interaction with the system users should see changes in nutrition information in real time. Newly created recipes could be tagged with a category from a list.


### User Stories - Project Timeline

- Authenticate users - Register, Login, Logout
- Users can CRUD recipes
- Users can search list of recipes by name or filter by category
- Users can search for product and filter by product group


### Stack

- MariaDB/MySQL
- TypeORM
- NestJS

----------

# Getting started

## Installation

Clone the repository

    git clone https://github.com/JoomFX/chefsbook-backend.git

Switch to the repo folder

    cd chefsbook-backend
    
Install dependencies
    
    npm install

----------

## Database

### MariaDB/MySQL

The example codebase uses [Typeorm](http://typeorm.io/) with a MariaDB database.

Create a new MariaDB database with the name `recipes_db` (or the name you specified in the ormconfig.json).

MariaDb database settings are in `ormconfig.json`.

Start local MariaDB server and create new database 'recipes_db'.

You will need a `.env` file as. You can modify the one included in the project.


## NPM scripts

- `npm start` - Start application
- `npm run start:dev` - Start application in nodemon
- `npm run typeorm` - run Typeorm commands
- `npm run seed` - initial seed for the database
- `npm run test` - run Jest test runner

----------
