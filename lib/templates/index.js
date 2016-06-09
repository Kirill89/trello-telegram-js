'use strict';


const _ = require('lodash');
const fs = require('fs');
const path = require('path');


let templates = {};


fs.readdirSync(__dirname).forEach(tplFileName => {
  let ext = path.extname(tplFileName);
  let name = path.basename(tplFileName, ext);

  if (ext === '.lodash') {
    templates[name] = _.template(fs.readFileSync(path.join(__dirname, tplFileName)));
  }
});


module.exports = templates;
