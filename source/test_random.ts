/**
 * Example of reading data from ./data/qa_builds_and_runs_from_bamboo.json
 * to transforming the data
 * to saving transformed data into a MySQL database.
 */

import { IDataCollector } from "./datacollectors/IDataCollector"
// import { JsonDataCollector } from "./datacollectors/JsonDataCollector"
import { PythonShellJsonDataCollector } from "./datacollectors/PythonShellJsonDataCollector"
import { IDataInterface } from "./datainterfaces/IDataInterface"
import { QaBuildsAndRunsFromBambooDataInterface } from "./datainterfaces/QaBuildsAndRunsFromBambooDataInterface"
import { IDataStorage } from "./datastorages/IDataStorage"
import { MysqlDataStorage } from "./datastorages/MysqlDataStorage"
// import { ISchedule } from "./scheduler/ISchedule"
import { Scheduler } from "./scheduler/Scheduler"
const config = require("../config/config")

const storage: IDataStorage = new MysqlDataStorage(config.db.host, config.db.dbname, config.db.username, config.db.password);
const scheduler: Scheduler = new Scheduler(storage);

RunThroughPipeline();
async function RunThroughPipeline()
{
    // const dataReaderFromJsonFile: IDataCollector = new JsonDataCollector("./data/qa_builds_and_runs_from_bamboo.json", "*");
    const dataCollector: IDataCollector = new PythonShellJsonDataCollector("./data/test_print_json.py", "*");
    const dataInterface: IDataInterface = new QaBuildsAndRunsFromBambooDataInterface();

    console.log("Connecting to MySQL database...");
    await storage.Initialize();

    console.log("Scheduling QaBuildsAndRunsFromBambooDataInterface...");
    await scheduler.Schedule(
    {
        DataCollector: dataCollector,
        DataInterface: dataInterface,
        RunIntervalInMinutes: 100,

        DataFromDate: new Date("2017-01-01"),
        DataToDate: new Date("2017-04-01")
    });

    // console.log("Disconnecting MySQL database...");
    // storage.Dispose();

    // console.log("Finished pipeline-in test.");
}