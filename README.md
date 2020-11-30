# #brobots eco frontend

![GitHub release (latest by date)](https://img.shields.io/github/v/release/brobots-hub/ecobrobotsfrontend?style=flat&logo=github&labelColor=181717&color=F8F8F5)
[![#brobots eco website](https://img.shields.io/badge/%23brobots-eco-fff000)](http://eco.brobots.org.ua)

Renewed frontend for #brobots eco. Includes new UI and improved UX.

**#brobots eco** is a net of sensors that collect data about air quality in Brovary.

## Project setup

### Install Parcel globally

`npm -g install parcel-bundler`

or

`yarn global install parcel-bundler`

### Install dependencies

`npm i` or `yarn`

## Usage

### Run dev server

`npm start`

or

`yarn start`

### Build project

`npm run build`

or

`yarn build`

### Deploy project

You have to be whitelisted on the server and have credentials for it.

`npm run deploy`

or

`yarn deploy`

## For WSL users

I use WSL as my working system and I spent lots of time debugging this small thing: hot reload isn't working if your project is on Windows partition. Move the project to WSL part. It also works much faster there.

## [eco backend](https://github.com/andrew4ever/ecobrobotsbackend)
