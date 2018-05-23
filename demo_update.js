var fs = require("fs")
var db = require("./build/datastorages/MysqlDataStorage");
var config = require("./config/config");

var dir = "./config";
fs.createReadStream(`./no_schedules.js`).pipe(fs.createWriteStream(`${dir}/schedules.js`));

changedata();
async function changedata()
{
    var conn = new db.MysqlDataStorage(config.db.connection);
    await conn.Initialize();
    await conn.Query
    (`
        UPDATE qa_builds_and_runs_from_bamboo
        SET MINUTES_TOTAL_QUEUE_AND_BUILD = 9999
        WHERE BUILD_COMPLETED_DATE BETWEEN '2018-03-29' AND '2018-04-02'
    `);
    process.exit();
}