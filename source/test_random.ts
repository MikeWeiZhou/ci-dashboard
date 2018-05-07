/**
 * Example of reading data from ./data/qa_builds_and_runs_from_bamboo.json
 * to transforming the data
 * to saving transformed data into a MySQL database.
 */

import * as moment from "moment"
const config = require("../config/config")

var mydate: Date = new Date("2018-01-01");
console.log(mydate);
console.log(moment.utc(new Date(mydate)).format(config.dateformat.python));