'use strict';


const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Logger = require('./logger');
const Repository = require('./repository');
const Bot = require('./bot');
const Trello = require('./trello');
const Notifyer = require('./notifyer');


module.exports = function () {
  const logger = new Logger();
  const config = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'config.yml'), 'utf8'));
  const repository = new Repository();
  const bot = new Bot(repository, logger, config);
  const trello = new Trello(config);
  const notifyer = new Notifyer(repository, bot, trello, logger, config);

  notifyer.start();
};
