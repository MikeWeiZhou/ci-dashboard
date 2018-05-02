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
var TransformStream = (function (_super) {
    __extends(TransformStream, _super);
    function TransformStream(dataTransformer) {
        var _this = _super.call(this, {
            objectMode: true
        }) || this;
        _this._dataTransformer = dataTransformer;
        return _this;
    }
    TransformStream.prototype._transform = function (jsonObj, encoding, callback) {
        this.push(this._dataTransformer.Transform(jsonObj));
        callback();
    };
    return TransformStream;
}(stream_1.Transform));
exports.TransformStream = TransformStream;
