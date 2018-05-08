// import { JsonDataCollector } from "./datacollectors/JsonDataCollector"
import { PythonShellJsonDataCollector } from "./datacollectors/PythonShellJsonDataCollector"
import { QaBuildsAndRunsFromBambooDataInterface } from "./datainterfaces/QaBuildsAndRunsFromBambooDataInterface"
import { IDataStorage } from "./datastorages/IDataStorage"
import { Scheduler } from "./scheduler/Scheduler"
import { ISchedule } from "./scheduler/ISchedule";
const config = require("../config/config")

export async function startscheduler(storage: IDataStorage): Promise<void>
{
    console.log("Starting scheduler...");

    const scheduler: Scheduler = new Scheduler(storage);
    const schedules: Array< {name: string, schedule: ISchedule} > =
    [
        {
            name: "QaBuildsAndRunsFromBamboo from test_print_json.py",
            schedule:
            {
                DataCollector: new PythonShellJsonDataCollector("./data/test_print_json.py", "*"),
                DataInterface: new QaBuildsAndRunsFromBambooDataInterface(),
                RunIntervalInMinutes: config.scheduler.interval.qa_builds_and_runs_from_bamboo,

                DataFromDate: new Date("2017-01-01"),
                DataToDate: new Date("2017-04-01")
            }
        }
        // {
        //     name: "QaBuildsAndRunsFromBamboo from qa_builds_and_runs_from_bamboo.json",
        //     schedule:
        //     {
        //         DataCollector: new JsonDataCollector("./data/qa_builds_and_runs_from_bamboo.json", "*"),
        //         DataInterface: new QaBuildsAndRunsFromBambooDataInterface(),
        //         RunIntervalInMinutes: config.scheduler.interval.qa_builds_and_runs_from_bamboo
        //     }
        // }
    ];

    for (let i: number = 0; i < schedules.length; ++i)
    {
        var isScheduled: boolean = false;
        try
        {
            isScheduled = await scheduler.Schedule(schedules[i].schedule);
        }
        catch (err)
        {
            console.log("ERROR:");
            console.log(err);
        }

        console.log
        (
            (isScheduled)
                ? `Scheduled: ${schedules[i].name}. Interval: ${schedules[i].schedule.RunIntervalInMinutes} minutes.`
                : `Failed to schedule: ${schedules[i].name}.`
        );
    }
}