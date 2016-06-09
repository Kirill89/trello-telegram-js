'use strict';


const Datastore = require('nedb');
const path = require('path');


const DB_PATH = path.join(__dirname, '..', 'db');


class Repository {

  constructor() {
    this._db = {
      users: new Datastore({ filename: path.join(DB_PATH, 'users.db'), autoload: true }),
      notifications: new Datastore({ filename: path.join(DB_PATH, 'notifications.db'), autoload: true })
    };
  }


  updateToken(chatId, token) {
    return new Promise((res, rej) => {
      this._db.users.update({ chatId }, { chatId, token }, { upsert: true }, err => {
        if (err) {
          rej(err);
          return;
        }

        res();
      });
    });
  }


  removeToken(chatId) {
    return new Promise((res, rej) => {
      this._db.users.remove({ chatId }, err => {
        if (err) {
          rej(err);
          return;
        }

        res();
      });
    });
  }


  getTokens() {
    return new Promise((res, rej) => {
      this._db.users.find({}, (err, docs) => {
        if (err) {
          rej(err);
          return;
        }

        res(docs);
      });
    });
  }


  markRead(notificationKey) {
    return new Promise((res, rej) => {
      this._db.notifications.update({ notificationKey }, { notificationKey }, { upsert: true }, err => {
        if (err) {
          rej(err);
          return;
        }

        res();
      });
    });
  }


  checkRead(notificationKey) {
    return new Promise((res, rej) => {
      this._db.notifications.count({ notificationKey }, (err, count) => {
        if (err) {
          rej(err);
          return;
        }

        res(count > 0);
      });
    });
  }
}


module.exports = Repository;
