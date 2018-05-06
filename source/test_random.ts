// import { PythonShell } from "python-shell"

var PythonShell = require("python-shell");
var testShell = new PythonShell("./data/test_print_json.py", {mode: "text"});

testShell.send("one\ntwo");

testShell.stdout.on("data", (data: any) =>
{
    console.log(data + "\n\n\n");
});

testShell.end(function (err: any, code: any, signal: any) {
    console.log('The exit code was: ' + code);
    console.log('The exit signal was: ' + signal);
    console.log('finished');
    console.log('finished');
    if (err) throw err;
});