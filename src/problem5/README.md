## Prerequisites

This starter has minimal prerequisites and most of these will usually already be installed on your computer.

- [Install Node.js](https://nodejs.org/en/download/)
- [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Install Docker](https://docs.docker.com/engine/install/)

## Setting up development environment

- Clone project

  ```
  git clone https://github.com/luongdao138/luongdao-coding-challenge.git
  cd src/problem5
  ```

- From now on, all the commands will be run under the `problem5` folder

- Install dependencies
  ```
  npm install
  ```
- Start DB Local

  ```bash
   docker compose up -d
  ```

- Copy `.env.example` file

  ```
  cp .env.example .env
  ```

- Make sure all the envs are set correctly in the `.env` file. Here is the sample env file

```
# No need on production (only for local)
HTTP_LOGGING=true

CORS_ORIGIN=http://localhost:3000,http://localhost:3001
DATABASE_URL=postgres://postgres:postgres@localhost:5434/crud-dev
DATABASE_SSL=false
```

Your local server is now running on port **9000**.

- Migrate data

```shell
$ npm run migration:run
```

- to create a new migration file (template)

  ```shell
  npm run migration:create <path-to-migration-file>
  ```

## Run the application

```
  npm run start
```

## Some notes

- I setup the codebase for an Express.js application. This includes:
  - eslint, typescript, prettier setup
  - database and migration setup
  - error handling
  - request and response dtos setup with zod validator
  - dependency injection setup with awilix library
  - app dockerization setup
- Currently, I have only one entity `Book` in the codebase with all the CRUD functionalities setup.
