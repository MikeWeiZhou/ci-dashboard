"use strict";
exports.__esModule = true;
var fs = require("fs");
var json = require("JSONStream");
var JsonDataCollector = (function () {
    function JsonDataCollector(filepath, jsonParsePath) {
        this._filepath = filepath;
        this._jsonParsePath = jsonParsePath;
    }
    JsonDataCollector.prototype.Initialize = function (from, to) {
    };
    JsonDataCollector.prototype.GetStream = function () {
        var _jsonStream = json.parse(this._jsonParsePath);
        return fs.createReadStream(this._filepath)
            .on("error", function (err) { _jsonStream.emit("error", err); })
            .pipe(_jsonStream);
    };
    JsonDataCollector.prototype.Dispose = function () {
    };
    return JsonDataCollector;
}());
exports.JsonDataCollector = JsonDataCollector;
