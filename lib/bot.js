'use strict';


const TelegramBot = require('node-telegram-bot-api');
const templates = require('./templates');


class Bot {

  /**
   * @param {Repository} repository
   * @param {Logger} logger
   */
  constructor(repository, logger, config) {
    this._repository = repository;
    this._logger = logger;
    this._config = config;
    this._driver = new TelegramBot(this._config.telegram_token, { polling: true });

    this._initHandlers();
  }


  sendMessage(chatId, message) {
    return this._driver.sendMessage(chatId, message);
  }


  _initHandlers() {
    this._driver.onText(/\/help|\/start/, msg => {
      let fromId = msg.from.id;

      this.sendMessage(fromId, templates.help())
        .catch(err => this._logger.log(err));
    });


    this._driver.onText(/\/stop/, msg => {
      let fromId = msg.from.id;

      this._repository.removeToken(fromId)
        .then(() => this.sendMessage(fromId, templates.stop()))
        .catch(err => this._logger.log(err));
    });


    this._driver.onText(/\/login/, msg => {
      let fromId = msg.from.id;

      this.sendMessage(fromId, templates.start({ name: this._config.trello_app_name, key: this._config.trello_key }))
        .catch(err => this._logger.log(err));
    });


    this._driver.onText(/\/token (.+)/, (msg, match) => {
      let fromId = msg.from.id;
      let token = match[1];

      this._repository.updateToken(fromId, token)
        .then(() => this.sendMessage(fromId, templates.token()))
        .catch(err => this._logger.log(err));
    });
  }
}


module.exports = Bot;
