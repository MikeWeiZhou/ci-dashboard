"use strict";
exports.__esModule = true;
var csv = require("csv-parse");
var fs = require("fs");
var CsvDataCollector = (function () {
    function CsvDataCollector(filepath) {
        this._filepath = filepath;
    }
    CsvDataCollector.prototype.Initialize = function (from, to) {
    };
    CsvDataCollector.prototype.GetStream = function () {
        var _csvStream = csv({ columns: true });
        return fs.createReadStream(this._filepath)
            .on("error", function (err) { _csvStream.emit("error", err); })
            .pipe(_csvStream);
    };
    CsvDataCollector.prototype.Dispose = function () {
    };
    return CsvDataCollector;
}());
exports.CsvDataCollector = CsvDataCollector;
