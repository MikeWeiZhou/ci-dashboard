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
var moment = require("moment");
var TransformStream_1 = require("../streams/TransformStream");
var WriteStream_1 = require("../streams/WriteStream");
var Log_1 = require("../Log");
var config = require("../../config/config");
var Scheduler = (function () {
    function Scheduler(dataStorage) {
        this._dataStorage = dataStorage;
        this._schedules = [];
    }
    Scheduler.prototype.Schedule = function (schedule) {
        return __awaiter(this, void 0, void 0, function () {
            var i, validSchedule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        for (i = 0; i < this._schedules.length; ++i) {
                            if (this._schedules[i] == schedule.DataInterface) {
                                return [2, false];
                            }
                        }
                        return [4, this.makeValidScheduleOrNull(schedule)];
                    case 1:
                        validSchedule = _a.sent();
                        if (validSchedule) {
                            this._schedules.push(schedule.DataInterface);
                            this.runSchedule(validSchedule);
                            return [2, true];
                        }
                        return [2, false];
                }
            });
        });
    };
    Scheduler.prototype.runSchedule = function (schedule) {
        var _this = this;
        var _this = this;
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var newSchedule, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {
                            DataCollector: schedule.DataCollector,
                            DataInterface: schedule.DataInterface,
                            RunIntervalInMinutes: schedule.RunIntervalInMinutes
                        };
                        return [4, _this.getLastDataToDateFromDb(schedule.DataInterface)];
                    case 1:
                        newSchedule = (_a.DataFromDate = _b.sent(),
                            _a.DataToDate = moment.utc(new Date()).add(schedule.RunIntervalInMinutes, 'm').toDate(),
                            _a);
                        _this.runSchedule(newSchedule);
                        return [2];
                }
            });
        }); }, schedule.RunIntervalInMinutes * 1000 * 60);
        console.log("Running schedule: " + schedule.DataInterface.TableName);
        schedule.DataCollector.Initialize(schedule.DataFromDate, schedule.DataToDate);
        schedule.DataCollector.GetStream()
            .pipe(new TransformStream_1.TransformStream(schedule.DataInterface))
            .pipe(new WriteStream_1.WriteStream(this._dataStorage, schedule.DataInterface))
            .on("finish", function () {
            _this.updateDataToDateInDb(schedule);
        });
    };
    Scheduler.prototype.makeValidScheduleOrNull = function (schedule) {
        return __awaiter(this, void 0, void 0, function () {
            var lastDataToDate, newSchedule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (schedule.RunIntervalInMinutes <= 0) {
                            return [2, null];
                        }
                        return [4, this.getLastDataToDateFromDb(schedule.DataInterface)];
                    case 1:
                        lastDataToDate = _a.sent();
                        newSchedule = {
                            DataCollector: schedule.DataCollector,
                            DataInterface: schedule.DataInterface,
                            RunIntervalInMinutes: schedule.RunIntervalInMinutes,
                            DataFromDate: schedule.DataFromDate || lastDataToDate,
                            DataToDate: schedule.DataToDate || new Date()
                        };
                        if (newSchedule.DataFromDate > newSchedule.DataToDate) {
                            return [2, null];
                        }
                        if (newSchedule.DataFromDate > lastDataToDate) {
                            return [2, null];
                        }
                        return [2, newSchedule];
                }
            });
        });
    };
    Scheduler.prototype.updateDataToDateInDb = function (schedule) {
        return __awaiter(this, void 0, void 0, function () {
            var results, date, query, err_1, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        date = moment.utc(schedule.DataToDate).format(config.dateformat.mysql);
                        query = "UPDATE " + config.db.tablename.data_source_tracker + "\n                            SET TO_DATE = '" + date + "'\n                            WHERE TABLE_NAME = '" + schedule.DataInterface.TableName + "'";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this._dataStorage.Query(query)];
                    case 2:
                        results = _a.sent();
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        Log_1.Log(err_1, "Errored when calling updateDataToDateInDb in Scheduler\n\nSQL Query: " + query);
                        throw err_1;
                    case 4:
                        if (results.affectedRows == 0) {
                            err = new Error(schedule.DataInterface.TableName + " not tracked. Error thrown in Scheduler. Recommended running \"npm run setup\" again");
                            Log_1.Log(err, "SQL Query: " + query);
                            throw err;
                        }
                        return [2];
                }
            });
        });
    };
    Scheduler.prototype.getLastDataToDateFromDb = function (dataInterface) {
        return __awaiter(this, void 0, void 0, function () {
            var results, query, err_2, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "SELECT FROM_DATE, TO_DATE\n                            FROM " + config.db.tablename.data_source_tracker + "\n                            WHERE TABLE_NAME = '" + dataInterface.TableName + "'";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, this._dataStorage.Query(query)];
                    case 2:
                        results = _a.sent();
                        return [3, 4];
                    case 3:
                        err_2 = _a.sent();
                        Log_1.Log(err_2, "Errored when calling getLastDataToDateFromDb in Scheduler\n\nSQL Query: " + query);
                        throw err_2;
                    case 4:
                        if (results.length == 0) {
                            err = new Error(dataInterface.TableName + " not tracked. Error thrown in Scheduler. Recommended running \"npm run setup\" again");
                            Log_1.Log(err, "SQL Query: " + query);
                            throw err;
                        }
                        return [2, new Date(results.TO_DATE)];
                }
            });
        });
    };
    return Scheduler;
}());
exports.Scheduler = Scheduler;
