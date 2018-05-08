"use strict";
exports.__esModule = true;
var moment = require("moment");
var fs_1 = require("fs");
var config = require("../config/config");
var logDirectory = "./" + config.log.directory;
function Log(error, additionalInfo) {
    var date = new Date();
    var datestamp = moment.utc(date).format("YYYY-MM-DD HH.mm.ss");
    var rand = Math.floor((Math.random() * 1000) + 1);
    var filename = logDirectory + "/" + datestamp + " " + rand + ".log";
    var metadata = "TIMESTAMP: " + date + "\n\n" + additionalInfo;
    fs_1.writeFile(filename, metadata + "\n\n" + error + "\n\n" + error.stack, function (error) {
        if (error) {
            console.log(error);
        }
    });
}
exports.Log = Log;
