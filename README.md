## Code challenge

Implement an API to detect DNA mutations.

Mutation is detected if more than one sequence of four repeated letters is found either, horizontally, vertically or diagonally (forward/back).

Getting a mutation the process should return an http 200 status code, otherwise a 403 forbidden status.
Letters allowed to represent ADN sequences are (A,T,C,G).

Expose an extra service “/ stats” that returns a JSON with the DNA verification statistics: {“count_mutations”: 40, “count_no_mutation”: 100: “ratio”: 0.4}


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
## Demo
https://challenge-dna-api.herokuapp.com/api/


## Author
[Samuel Zuniga Vanoye](mailto:samuelzv@gmail.com)

## License
[MIT licensed](LICENSE).
