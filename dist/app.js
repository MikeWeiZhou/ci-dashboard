"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var App = (function () {
    function App() {
        this.app = express();
        this.config();
        this.routes();
    }
    App.prototype.config = function () {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    };
    App.prototype.routes = function () {
        var router = express.Router();
        router.get('/', function (req, res) {
            res.status(200).send({
                message: 'Hello World!'
            });
        });
        router.post('/', function (req, res) {
            var data = req.body;
            res.status(200).send(data);
        });
        this.app.use('/', router);
    };
    return App;
}());
exports["default"] = new App().app;
