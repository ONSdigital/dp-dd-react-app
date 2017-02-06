DP data discovery front-end [ALPHA]
================

A React application for the front-end of the data discovery journeys and UIs being tested for the [ONS website](https://www.ons.gov.uk).

### Prequisites

#### Environment

You'll need both [Node](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) installed before starting. 

####  Dependencies

##### Go services

Checkout `develop` branch on all _dp-dd-\*_ repos.
- `github.com/ONSdigital/dp-dd-api-stub`
- `github.com/ONSdigital/dp-dd-job-creator-api-stub`
- `github.com/ONSdigital/dp-dd-frontend-controller`

Checkout `dd-develop` on _dp-\*_ repos.
- `github.com/ONSdigital/dp-frontend-renderer`
- `github.com/ONSdigital/dp-frontend-router`

Run all services with `make debug`.

> You should check individual `README.md` files for more configuration and debug/build details.

##### Other dependencies

- [sixteens](https://github.com/ONSdigital/sixteens)
    - use `develop` branch
    - start with `./run.sh`

- [babbage](https://github.com/ONSdigital/babbage)
    - use `develop` branch
    - start with `./run.sh`

### Run application locally

Using NPM

```
npm install
```
  
Using [Yarn](https://github.com/yarnpkg/yarn)
```
yarn
```

Start local dev server
```
./run.sh
```

It will host the application, auto-build and reload on file changes using. 

<strike>
By default app will be servered via `:20040` but will accept another port as an argument, eg `PORT=7000 ./run.sh`.
</strike>

> **IMPORTANT UPDATE** 
>   
> Currently app doesn't run on its own.
> You need all above dependency services up and running.
>   
> Once started it will be served from `localhost:20000` via `dp-frontend-router`

### Building application

```
npm run build
```
 
### Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for details.

### License

Copyright ©‎ 2016, Office for National Statistics (https://www.ons.gov.uk)

Released under MIT license, see [LICENSE](LICENSE.md) for details.
