// import { JsonDataCollector } from "./datacollectors/JsonDataCollector"
import { PythonShellJsonDataCollector } from "./datacollectors/PythonShellJsonDataCollector"
import { QaBuildsAndRunsFromBambooDataInterface } from "./datainterfaces/QaBuildsAndRunsFromBambooDataInterface"
import { IDataStorage } from "./datastorages/IDataStorage"
import { Scheduler } from "./scheduler/Scheduler"
const config = require("../config/config")

export async function startscheduler(storage: IDataStorage): Promise<void>
{
    const scheduler: Scheduler = new Scheduler(storage);

    // scheduler.Schedule(
    // {
    //     DataCollector: new JsonDataCollector("./data/qa_builds_and_runs_from_bamboo.json", "*"),
    //     DataInterface: new QaBuildsAndRunsFromBambooDataInterface(),
    //     RunIntervalInMinutes: config.scheduler.interval.qa_builds_and_runs_from_bamboo
    // });

    await scheduler.Schedule(
    {
        DataCollector: new PythonShellJsonDataCollector("./data/test_print_json.py", "*"),
        DataInterface: new QaBuildsAndRunsFromBambooDataInterface(),
        RunIntervalInMinutes: config.scheduler.interval.qa_builds_and_runs_from_bamboo,

        DataFromDate: new Date("2017-01-01"),
        DataToDate: new Date("2017-04-01")
    });
}