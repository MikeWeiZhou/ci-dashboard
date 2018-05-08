"use strict";
exports.__esModule = true;
var moment = require("moment");
var config = require("../config/config");
var mydate = new Date("2018-01-01");
console.log(mydate);
console.log(moment.utc(new Date(mydate)).format(config.dateformat.python));
