"use strict";
exports.__esModule = true;
var moment = require("moment");
var PythonShell = require("python-shell");
var json = require("JSONStream");
var config = require("../../config/config");
var PythonShellJsonDataCollector = (function () {
    function PythonShellJsonDataCollector(filepath, jsonParsePath) {
        this._filepath = filepath;
        this._jsonParsePath = jsonParsePath;
        this._isInitialized = false;
    }
    PythonShellJsonDataCollector.prototype.Initialize = function (from, to) {
        var fromDate = moment.utc(from).format(config.dateformat.python);
        var toDate = moment.utc(to).format(config.dateformat.python);
        this._pythonShell = new PythonShell(this._filepath, { mode: "text" });
        this._pythonShell.send(fromDate).send(toDate);
        var __this = this;
        this._pythonShell.end(function (err, code, signal) {
            if (err) {
                __this._pythonShell.stdout.emit("error", err);
                return;
            }
            __this._pythonShell.stdout.push(null);
        });
        this._isInitialized = true;
    };
    PythonShellJsonDataCollector.prototype.GetStream = function () {
        if (!this._isInitialized) {
            throw new Error("PythonShellJsonDataCollector NOT_INITIALIZED_ERR");
        }
        var _jsonStream = json.parse(this._jsonParsePath);
        return this._pythonShell.stdout
            .on("error", function (err) { _jsonStream.emit("error", err); })
            .pipe(_jsonStream);
    };
    PythonShellJsonDataCollector.prototype.Dispose = function () {
    };
    return PythonShellJsonDataCollector;
}());
exports.PythonShellJsonDataCollector = PythonShellJsonDataCollector;
