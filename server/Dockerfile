FROM rust:1.89-slim AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y libpq-dev

COPY ./Cargo.toml .
COPY ./Cargo.lock .
COPY ./migrations ./migrations
COPY ./src ./src

RUN cargo build --release

FROM debian:13-slim AS runtime

WORKDIR /app

RUN apt-get update && apt-get install -y libpq-dev

COPY --from=builder /app/target/release/server .

EXPOSE 8080

ENTRYPOINT ["./server"]
