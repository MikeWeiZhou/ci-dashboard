"use strict";
exports.__esModule = true;
var assert = require("assert");
var fs = require("fs");
var PythonShellJsonDataCollector_1 = require("../../datacollectors/PythonShellJsonDataCollector");
describe("datacollectors/PythonShellJsonDataCollector", function () {
    var pyfile = "./source/unittests/datacollectors/unittests.py";
    var pyshell = new PythonShellJsonDataCollector_1.PythonShellJsonDataCollector(pyfile, "*");
    describe("Pre-requisite(s)", function () {
        it("python test file exists", function () {
            assert.equal(fs.existsSync(pyfile), true);
        });
    });
    describe("Initialization", function () {
        it("should throw NOT_INITIALIZED_ERR getting uninitialized stream", function () {
            assert.throws(function () {
                new PythonShellJsonDataCollector_1.PythonShellJsonDataCollector(pyfile, "*").GetStream();
            }, /NOT_INITIALIZED_ERR/);
        });
    });
    describe("Receive JSON Objects", function () {
        it("should receive correct # and identical json objects to ones sent", function (done) {
            var counter = 1;
            pyshell.Initialize(new Date("2018-01-01"), new Date());
            pyshell.GetStream()
                .on("data", function (data) {
                if (counter++ == 1) {
                    assert.equal(data.name, "Banana");
                    assert.equal(data.age, 3);
                }
                if (counter == 3) {
                    done();
                }
            });
        });
        it("should throw error and no data when python sends invalid json objects", function (done) {
            pyshell.Initialize(new Date("2018-01-02"), new Date());
            pyshell.GetStream()
                .on("data", function (data) {
                done(new Error("Data received for invalid json object"));
            })
                .on("error", function (err) {
                if (!/Invalid JSON/.test(err.message) && !/Exception ignored in/.test(err.message)) {
                    done(err);
                }
                done();
            });
        });
        it("should throw 'exited with code 10' error when python script crashes from sys.exit(10)", function (done) {
            pyshell.Initialize(new Date("2018-01-03"), new Date());
            pyshell.GetStream()
                .on("data", function (data) { })
                .on("error", function (err) {
                if (!/exited with code 10/.test(err.message)) {
                    done(err);
                }
                done();
            });
        });
        it("should throw 'ZeroDivisionError' when python script crashes from division by zero", function (done) {
            pyshell.Initialize(new Date("2018-01-04"), new Date());
            pyshell.GetStream()
                .on("data", function (data) { })
                .on("error", function (err) {
                if (!/ZeroDivisionError/.test(err.message)) {
                    done(err);
                }
                done();
            });
        });
    });
});
