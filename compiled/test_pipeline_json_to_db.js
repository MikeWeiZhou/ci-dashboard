"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var JsonDataReader_1 = require("./datareaders/JsonDataReader");
var QaBuildsAndRunsFromBambooDataTransformer_1 = require("./datatransformers/QaBuildsAndRunsFromBambooDataTransformer");
var MySqlStorage_1 = require("./storages/MySqlStorage");
var TransformStream_1 = require("./TransformStream");
var WriteStream_1 = require("./WriteStream");
var config = require("../config/config");
var storage = new MySqlStorage_1["default"](config.db.host, config.db.dbname, config.db.username, config.db.password);
RunThroughPipeline();
function RunThroughPipeline() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Running pipeline from datareader -> datatransformer -> storage.");
                    console.log("If completed successfully, no errors would be thrown and Node.js will exit after completion.");
                    return [4, storage.Initialize()];
                case 1:
                    _a.sent();
                    return [4, CreateTable()];
                case 2:
                    _a.sent();
                    return [4, ReadTransformAndSaveData()];
                case 3:
                    _a.sent();
                    storage.Dispose();
                    return [2];
            }
        });
    });
}
function CreateTable() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, storage.QueryOrNull("DROP TABLE IF EXISTS qa_builds_and_runs_from_bamboo")];
                            case 1:
                                _a.sent();
                                return [4, storage.QueryOrNull("\n            CREATE TABLE qa_builds_and_runs_from_bamboo\n            (\n                MINUTES_TOTAL_QUEUE_AND_BUILD   INT,\n                BUILD_COMPLETED_DATE            DATETIME,\n                PLATFORM                        CHAR(3),\n                PRODUCT                         CHAR(2),\n                IS_MASTER                       TINYINT(1),\n                IS_SUCCESS                      TINYINT(1)\n            )\n        ")];
                            case 2:
                                _a.sent();
                                resolve();
                                return [2];
                        }
                    });
                }); })];
        });
    });
}
function ReadTransformAndSaveData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var dataReader = new JsonDataReader_1["default"]("./data/qa_builds_and_runs_from_bamboo.json", "*");
                    var dataTransformer = new QaBuildsAndRunsFromBambooDataTransformer_1["default"]();
                    dataReader.Initialize();
                    dataReader.GetStream()
                        .pipe(new TransformStream_1["default"](dataTransformer))
                        .pipe(new WriteStream_1["default"](storage))
                        .on('finish', function () {
                        dataReader.Dispose();
                        resolve();
                    });
                })];
        });
    });
}
