'use strict';


const moment = require('moment');


class Logger {

  constructor() {
  }


  log(message) {
    /* eslint-disable no-console */
    console.log(`${moment().format()} - ${message}`);
  }
}


module.exports = Logger;
