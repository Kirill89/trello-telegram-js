'use strict';


const Promise = require('bluebird');
const moment = require('moment');
const templates = require('./templates');


class Notifyer {

  /**
   * @param {Repository} repository
   * @param {Bot} bot
   * @param {Trello} trello
   * @param {Logger} logger
   */
  constructor(repository, bot, trello, logger, config) {
    this._repository = repository;
    this._bot = bot;
    this._trello = trello;
    this._logger = logger;
    this._config = config;

    this._notifyActive = false;
  }


  start() {
    this._logger.log('Started');

    this.notify().catch(err => this._logger.log(err));

    this.checkTimer = setInterval(() => {
      this.notify().catch(err => this._logger.log(err));
    }, this._config.trello_check_interval);
  }


  notify() {
    if (this._notifyActive) return Promise.resolve();

    this._notifyActive = true;

    return Promise.coroutine(function*() {
      let tokensData = yield this._repository.getTokens();

      for (let i = 0; i < tokensData.length; i++) {
        let tokenData = tokensData[i];
        let notifications = [];

        try {
          notifications = yield this._trello.getNotifications(tokenData.token);
        } catch (__) {
          // Skip trello errors
        }

        for (let j = 0; j < notifications.length; j++) {
          let notification = notifications[j];

          yield this._sendNotification(tokenData.chatId, notification.card, notification.ts);
        }
      }

      this._notifyActive = false;
    }.bind(this))();
  }


  _sendNotification(chatId, card, ts) {
    return Promise.coroutine(function*() {
      if (ts > Date.now()) return;

      let key = `${chatId}_${card.id}_${ts}`;
      let read = yield this._repository.checkRead(key);

      if (read) return;

      let date = moment(card.due).format('LLL');

      yield this._bot.sendMessage(chatId, templates.notification({
        name: card.name,
        date,
        shortUrl: card.shortUrl
      }));
      yield this._repository.markRead(key);
    }.bind(this))();
  }
}


module.exports = Notifyer;
