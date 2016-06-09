'use strict';


const got = require('got');
const moment = require('moment');


class Trello {

  constructor(config) {
    this._config = config;
  }


  getNotifications(token) {
    return got
      .get('https://api.trello.com/1/search', {
        query: {
          key: this._config.trello_key,
          token,
          query: 'label:@notify',
          modelTypes: 'cards',
          partial: true
        },
        json: true
      })
      .then(response => {
        let notifications = [];

        response.body.cards.forEach(card => {
          let due = moment(card.due);

          if (!due.isValid()) return; // continue
          if (!card.labels.length) return; // continue
          if (card.closed) return; // continue

          card.labels.forEach(label => {
            if (label.name.indexOf('@notify') !== 0) return; // continue

            let diffHours = Number(label.name.substr('@notify'.length).trim());

            if (isNaN(diffHours)) return; // continue

            let notifyDate = due.clone().add(diffHours, 'hours');

            notifications.push({ ts: notifyDate.valueOf(), card });
          });
        });

        return notifications;
      });
  }
}


module.exports = Trello;
