# Project goChat

Slapdash is a Realtime chat application that's built using Golang, Solidjs, Typscript.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

- To run the backend you can use `make run`. This will build the application and run it.
- To run the frontned you should first go to the `client` folder and then do `pnpm install`. This will install all dependencies.
- Then from the root of the repository do `make client`. This will start the client.

## MakeFile

run all make commands with clean tests

```bash
make all build
```

build the application

```bash
make build
```

run the application

```bash
make run
```

Create DB container

```bash
make docker-run
```

Shutdown DB container

```bash
make docker-down
```

live reload the application

```bash
make watch
```

run the test suite

```bash
make test
```

clean up binary from the last build

```bash
make clean
```
