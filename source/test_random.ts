// import { PythonShell } from "python-shell"

var PythonShell = require("python-shell");
var testShell = new PythonShell("test.py", {mode: "json"});

testShell.stdout.on("data", (data: any) =>
{
    console.log(data + "\n\n\n");
});

testShell.end(function (err: any, code: any, signal: any) {
    if (err) throw err;
    console.log('The exit code was: ' + code);
    console.log('The exit signal was: ' + signal);
    console.log('finished');
    console.log('finished');
});