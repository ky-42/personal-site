# Personal Site

This is a personal website that anyone can customize and use. I created this site as a way to showcase my work, share my knowledge with others, and as a fun side project. You can see an example of the website at [kyledenief.me](https://kyledenief.me/).

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

After almost a year of development, I'm pleased to say that my personal website is essentially complete. I've learned a lot in the process, and I'm satisfied with the features I've incorporated. I do hope to add the ability to play asteroids in the background of the site sometime in the near future but that will be a big task.

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

- [Customization/Configuration Documentation](/config/README.md)
- [Client Documentation](/client/README.md)
- [Server Documentation](/server/README.md)

## Content Management

The manage page can be found at /manage on the client. For more information check out the [client documentation](/client/README.md).

## Run Locally

### Prerequisites

- Rust
- libpq-dev/postgresql-libs
- Diesel CLI
- Yarn (can use npm as well)
- A PostgreSQL server

### Running Client

1. Navigate to the `client` directory.
2. Install dependencies using `yarn install`.
3. Start the client server using `yarn start`.

Note: If you change the client server port, make sure to update the URL in the `.env` file in the `server` directory.

### Running Server

1. Navigate to the `server` directory.
2. Edit the `.env` file with your database information.
3. Ensure that you have a PostgreSQL database up and running (can use the docker compose file if you like).
4. Install the Diesel CLI and run `diesel database setup` in the servers root directory. Click [here](https://diesel.rs/guides/getting-started) for more information on installing the Diesel CLI.
5. Bring up the server with `cargo run`.

Note: If you change the server port or ip, make sure to update the URL in `client/src/adapters/index.ts`.

## Building

### Prerequisites

- Rust
- libpq-dev/postgresql-libs
- Yarn or npm

### Building Client

1. Update the `config/config.json` file with the production URLs of your frontend and backend servers, and optionally add your Plausible Analytics information.
2. Navigate to the `client` directory.
3. Build the client with `yarn build`.

### Building Server

1. Navigate to the `server` directory.
2. Build the server with `cargo build --release` (note if you get error that ends in `= note: /usr/bin/ld: cannot find -lpq: No such file or directory` it means you don't have libpq-dev/postgresql-libs installed).

Note: Database migrations are included in the release build so they will be ran when the server is run.

### Deployment

Theres no standard deployment method for the app, leaving it up to you. I personally have everything deployed on a Digital Ocean VM using NGINX as a reverse proxy. The server is run by a service on startup and PostgreSQL runs in a Docker container that is also brought up by a service. Make sure you have an updated `.env` file in the same folder as the release executable when it is ran. If you are having trouble deploying, don't be afraid to contact me.

## Contributing

Even though I am done contributing to the site for now, if you notice any issues or have any suggestions for how I can improve the site, feel free to create an issue or submit a pull request.
