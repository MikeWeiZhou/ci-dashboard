"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var stream_1 = require("stream");
var WriteStream = (function (_super) {
    __extends(WriteStream, _super);
    function WriteStream(storage) {
        var _this = _super.call(this, { objectMode: true }) || this;
        _this._storage = storage;
        return _this;
    }
    WriteStream.prototype._write = function (jsonObj, encoding, callback) {
        this._storage.Write("qa_builds_and_runs_from_bamboo", jsonObj);
        callback();
    };
    return WriteStream;
}(stream_1.Writable));
exports["default"] = WriteStream;
