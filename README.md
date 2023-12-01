# Personal Site

This is the repo for a personal website that anyone can customize and use. I created this site as a way to showcase my work, share my knowledge with others, and as a fun side project. You can see an example of the website at [kyledenief.me](https://kyledenief.me/).

## Features

- Contact, About, Home, Project, and Blog pages
- Full customization via JSON
- On-site content management
- Great error handling
- Responsive design
- Searching functionality
- Polished
- Good SEO

## Roadmap

After almost a year of development, I'm pleased to say that my personal website is essentially complete. I've learned a lot in the process, and I'm satisfied with the features I've incorporated. Although I had hoped to add the ability to play asteroids in the background of the site, I won't be able to do so anytime soon.

## Technologies Used

### Client

- TypeScript
- React
- Styled-components

### Server

- Rust
- Actix Web
- Diesel
- PostgreSQL

## Other READMEs

- [More on customization and configuration](/config/README.md)
- [More on client](/client/README.md)
- [More on server](/server/README.md)

## Content Management

The manage page can be found at /manage on the client. For more information check out [the client readme](/client/README.md)

## Run Locally

### Prerequisites

- Rust
- libpq-dev/postgresql-libs
- Diesel cli
- Yarn or npm
- A PostgreSQL server

### Running client (using yarn)

1. Navigate to the `client` directory
2. Install dependencies using `yarn install`
3. Start the client server using `yarn start`

Note: If you change the client server port, make sure to update the URL in the `.env` file in the `server` directory.

### Running server

1. Navigate to the `server` directory
2. Ensure that you have a PostgreSQL database up and running
3. Edit the `.env` file with your database information
4. Install the Diesel CLI and run `diesel database setup`
5. Bring up the server with `cargo run`

Note: If you change the server port or ip, make sure to update the URL in `client/src/adapters/index.ts`.

## Building

### Prerequisites

- Rust
- libpq-dev/postgresql-libs
- Yarn or npm

### Building client (using yarn)

1. Update the `config/config.json` file with the production URLs of your frontend and backend servers, and optionally add your Plausible Analytics information
2. Navigate to the `client` directory
3. Build the client with `yarn build`

### Building server

1. Navigate to the `server` directory
2. Build the server with `cargo build --release` (Note if you get error that ends in `= note: /usr/bin/ld: cannot find -lpq: No such file or directory` it means you don't have libpq-dev/postgresql-libs installed which you will need to install)

Note: Database migrations are included in the release build so they will be ran when the server is run.

### Deployment

I have decided not to have a standard deployment method for the app, leaving it up to each individual. I personally have the client deployed on a Digital Ocean VM using NGINX as a reverse proxy. The server is deployed on another VM that also runs the PostgreSQL database. The server is run by a service on startup and PostgreSQL runs in a Docker container that is also brought up by a server. You need the same but updated `.env` file from the `server` directory in the same folder as the release executable when it is ran. If you are having trouble deploying, don't be afraid to contact me.

## Contributing

Even though I am done contributing to the site for now, if you notice any issues or have any suggestions for how I can improve the site, feel free to create an issue or submit a pull request.
