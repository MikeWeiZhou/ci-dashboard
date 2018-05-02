"use strict";
exports.__esModule = true;
var mysql = require("mysql");
var MySqlStorageWriter = (function () {
    function MySqlStorageWriter(host, db, user, pass) {
        this._connection = mysql.createConnection({
            host: host,
            database: db,
            user: user,
            password: pass
        });
    }
    MySqlStorageWriter.prototype.Initialize = function () {
        this._connection.connect(function (error) {
            if (error) {
                console.log("MySQL connection error:");
                console.log(error);
                throw error;
            }
            console.log("Connected to MySQL database!");
        });
    };
    MySqlStorageWriter.prototype.Write = function (table, record) {
        var keys = Object.keys(record);
        var sql = "INSERT INTO " + table + " (";
        for (var i = 0; i < keys.length; ++i) {
            sql += keys[i] + ", ";
        }
        sql = sql.slice(0, -2);
        sql += ") VALUES(";
        for (var i = 0; i < keys.length; ++i) {
            sql += "'" + record[keys[i]] + "', ";
        }
        sql = sql.slice(0, -2);
        sql += ")";
        this.RawQuery(sql);
    };
    MySqlStorageWriter.prototype.RawQuery = function (sql) {
        this._connection.query(sql, function (error, result) {
            if (error) {
                console.log("MySQL raw query error: " + sql);
                console.log(error);
                throw error;
            }
            console.log("Raw query successfully executed: " + sql);
        });
    };
    MySqlStorageWriter.prototype.Cleanup = function () {
    };
    return MySqlStorageWriter;
}());
exports.MySqlStorageWriter = MySqlStorageWriter;
