"use strict";
exports.__esModule = true;
var json = require("JSONStream");
var fs = require("fs");
var JsonDataReader = (function () {
    function JsonDataReader(filepath, jsonParsePath) {
        this._filepath = filepath;
        this._jsonParsePath = jsonParsePath;
    }
    JsonDataReader.prototype.Initialize = function () {
    };
    JsonDataReader.prototype.GetStream = function () {
        return fs.createReadStream(this._filepath)
            .pipe(json.parse(this._jsonParsePath));
    };
    JsonDataReader.prototype.Dispose = function () {
    };
    return JsonDataReader;
}());
exports["default"] = JsonDataReader;
