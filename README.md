Simple telegram bot server to notify about deadlines in Trello.

To start now just [click here](https://telegram.me/trellonotifybot) or add @trellonotifybot to your telegram contacts.

## Features

- small
- no database needed
- simple to interact

## Deploy

You can use existing bot `@trellonotifybot`, or create your own.

1. clone this repository
2. copy `config.yml.example` to `config.yml`
3. fill `telegram_token` and `trello_key` in `config.yml`
4. run `npm install`
5. run server using `npm run start` (or `npm run forever` to run using [pm2](http://pm2.keymetrics.io/))
