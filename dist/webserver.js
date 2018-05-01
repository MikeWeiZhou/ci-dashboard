"use strict";
exports.__esModule = true;
var app_1 = require("./app");
var port = 80;
app_1["default"].listen(port, function () {
    console.log('Express server listening on port ' + port);
});
