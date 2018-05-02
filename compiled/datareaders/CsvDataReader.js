"use strict";
exports.__esModule = true;
var csv = require("csv-parse");
var fs = require("fs");
var CsvDataReader = (function () {
    function CsvDataReader(filepath) {
        this._filepath = filepath;
    }
    CsvDataReader.prototype.Initialize = function () {
    };
    CsvDataReader.prototype.GetStream = function () {
        return fs.createReadStream(this._filepath)
            .pipe(csv({ columns: true }));
    };
    CsvDataReader.prototype.Cleanup = function () {
    };
    return CsvDataReader;
}());
exports.CsvDataReader = CsvDataReader;
