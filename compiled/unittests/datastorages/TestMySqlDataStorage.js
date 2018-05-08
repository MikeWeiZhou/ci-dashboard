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
var _this = this;
exports.__esModule = true;
var assert = require("assert");
var assertextentions = require("../assertextentions");
var MysqlDataStorage_1 = require("../../datastorages/MysqlDataStorage");
var config = require("../../../config/config");
var storage;
describe("datastorages/MysqlDataStorage", function () {
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        var createDummyTable, createDummyData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    createDummyTable = "\n            CREATE TABLE dummy_test_table\n            (\n                ID   INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,\n                NAME VARCHAR(255) NOT NULL,\n                AGE  INT          NOT NULL\n            )\n        ";
                    createDummyData = "\n            INSERT INTO dummy_test_table (NAME, AGE) VALUES\n            (\"Mike\", 1),\n            (\"Tony\", 10),\n            (\"Johnny\", 100),\n            (\"Elisa\", 1000)\n        ";
                    storage = new MysqlDataStorage_1.MysqlDataStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);
                    return [4, storage.Initialize()];
                case 1:
                    _a.sent();
                    return [4, storage.Query(createDummyTable)];
                case 2:
                    _a.sent();
                    return [4, storage.Query(createDummyData)];
                case 3:
                    _a.sent();
                    return [2];
            }
        });
    }); });
    describe(".Initialize", function () {
        it("should throw ER_ACCESS_DENIED_ERROR with wrong credentials", function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, assertextentions.assertThrowsAsync(/ER_ACCESS_DENIED_ERROR/, function () { return __awaiter(_this, void 0, void 0, function () {
                            var storage;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        storage = new MysqlDataStorage_1.MysqlDataStorage(config.db.host, config.db.dbname, "wrong_username", "password");
                                        return [4, storage.Initialize()];
                                    case 1:
                                        _a.sent();
                                        return [2];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
    });
    describe(".Query", function () {
        it("should return empty array for select query with zero results", function () { return __awaiter(_this, void 0, void 0, function () {
            var noResultsQuery, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        noResultsQuery = "SELECT * FROM dummy_test_table WHERE NAME = 'non-existent-name'";
                        return [4, storage.Query(noResultsQuery)];
                    case 1:
                        results = _a.sent();
                        assert.equal(results.length, 0);
                        return [2];
                }
            });
        }); }),
            it("should throw ER_BAD_FIELD_ERROR non-existent field", function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, assertextentions.assertThrowsAsync(/ER_BAD_FIELD_ERROR/, function () { return __awaiter(_this, void 0, void 0, function () {
                                var nonExistentFieldQuery;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            nonExistentFieldQuery = "SELECT * FROM dummy_test_table WHERE NON_EXISTENT_FIELD = 'non-existent-name'";
                                            return [4, storage.Query(nonExistentFieldQuery)];
                                        case 1:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); }),
            it("should throw ER_PARSE_ERROR on invalid query", function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, assertextentions.assertThrowsAsync(/ER_PARSE_ERROR/, function () { return __awaiter(_this, void 0, void 0, function () {
                                var invalidQuery;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            invalidQuery = "once upon a time..";
                                            return [4, storage.Query(invalidQuery)];
                                        case 1:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); }),
            it("query results length should match the database data", function () { return __awaiter(_this, void 0, void 0, function () {
                var twoResultsQuery, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            twoResultsQuery = "SELECT * FROM dummy_test_table WHERE AGE < 20";
                            return [4, storage.Query(twoResultsQuery)];
                        case 1:
                            results = _a.sent();
                            assert.equal(results.length, 2);
                            return [2];
                    }
                });
            }); });
    });
    describe(".Write", function () {
        it("should return true and data saved when writing single valid data set to database", function () { return __awaiter(_this, void 0, void 0, function () {
            var keys, data, isSuccess, query, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = ["NAME", "AGE"];
                        data = ["Jennifer", 6];
                        return [4, storage.Write("dummy_test_table", keys, data)];
                    case 1:
                        isSuccess = _a.sent();
                        assert.equal(isSuccess, true);
                        query = "SELECT * FROM dummy_test_table WHERE NAME = 'Jennifer' AND AGE = 6";
                        return [4, storage.Query(query)];
                    case 2:
                        results = _a.sent();
                        assert.equal(results.length, 1);
                        return [2];
                }
            });
        }); }),
            it("should return true and data saved when writing valid data strings with spaces", function () { return __awaiter(_this, void 0, void 0, function () {
                var keys, data, isSuccess, query, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            keys = ["NAME", "AGE"];
                            data = ["some space inbetween", 6];
                            return [4, storage.Write("dummy_test_table", keys, data)];
                        case 1:
                            isSuccess = _a.sent();
                            assert.equal(isSuccess, true);
                            query = "SELECT * FROM dummy_test_table WHERE NAME = 'some space inbetween' AND AGE = 6";
                            return [4, storage.Query(query)];
                        case 2:
                            results = _a.sent();
                            assert.equal(results.length, 1);
                            return [2];
                    }
                });
            }); }),
            it("should return true and data saved when writing multiple valid data sets to database", function () { return __awaiter(_this, void 0, void 0, function () {
                var keys, data, isSuccess, query, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            keys = ["NAME", "AGE"];
                            data = [["BigTommy", 99], ["BigTommy", 15]];
                            return [4, storage.Write("dummy_test_table", keys, data)];
                        case 1:
                            isSuccess = _a.sent();
                            assert.equal(isSuccess, true);
                            query = "SELECT * FROM dummy_test_table WHERE NAME = 'BigTommy' AND AGE = 99";
                            return [4, storage.Query(query)];
                        case 2:
                            results = _a.sent();
                            assert.equal(results.length, 1);
                            query = "SELECT * FROM dummy_test_table WHERE NAME = 'BigTommy' AND AGE = 15";
                            return [4, storage.Query(query)];
                        case 3:
                            results = _a.sent();
                            assert.equal(results.length, 1);
                            return [2];
                    }
                });
            }); }),
            it("should throw ER_TRUNCATED_WRONG_VALUE_FOR_FIELD and data not saved when writing invalid data to database", function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var query, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, assertextentions.assertThrowsAsync(/ER_TRUNCATED_WRONG_VALUE_FOR_FIELD/, function () { return __awaiter(_this, void 0, void 0, function () {
                                var keys, data;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            keys = ["NAME", "AGE"];
                                            data = ["BigBlooper1", "string"];
                                            return [4, storage.Write("dummy_test_table", keys, data)];
                                        case 1:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            query = "SELECT * FROM dummy_test_table WHERE NAME = 'BigBlooper1'";
                            return [4, storage.Query(query)];
                        case 2:
                            results = _a.sent();
                            assert.equal(results.length, 0);
                            return [2];
                    }
                });
            }); }),
            it("should throw ER_BAD_FIELD_ERROR and data not saved when writing invalid key to database", function () { return __awaiter(_this, void 0, void 0, function () {
                var _this = this;
                var query, results;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, assertextentions.assertThrowsAsync(/ER_BAD_FIELD_ERROR/, function () { return __awaiter(_this, void 0, void 0, function () {
                                var keys, data;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            keys = ["NAME", "NON_EXISTENT_FIELD"];
                                            data = ["BigBlooper2", 6];
                                            return [4, storage.Write("dummy_test_table", keys, data)];
                                        case 1:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); })];
                        case 1:
                            _a.sent();
                            query = "SELECT * FROM dummy_test_table WHERE NAME = 'BigBlooper2'";
                            return [4, storage.Query(query)];
                        case 2:
                            results = _a.sent();
                            assert.equal(results.length, 0);
                            return [2];
                    }
                });
            }); });
    });
    after(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, storage.Query('DROP TABLE dummy_test_table')];
                case 1:
                    _a.sent();
                    storage.Dispose();
                    return [2];
            }
        });
    }); });
});
