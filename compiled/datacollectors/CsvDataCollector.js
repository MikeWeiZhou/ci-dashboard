"use strict";
exports.__esModule = true;
var csv = require("csv-parse");
var fs = require("fs");
var CsvDataCollector = (function () {
    function CsvDataCollector(filepath) {
        this._filepath = filepath;
    }
    CsvDataCollector.prototype.Initialize = function () {
    };
    CsvDataCollector.prototype.GetStream = function () {
        return fs.createReadStream(this._filepath)
            .pipe(csv({ columns: true }));
    };
    CsvDataCollector.prototype.Cleanup = function () {
    };
    return CsvDataCollector;
}());
exports.CsvDataCollector = CsvDataCollector;
