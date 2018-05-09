import { IDataStorage } from "../datastorages/IDataStorage"
import { Scheduler } from "./Scheduler"
const schedules = require("../../config/schedules")

export async function startscheduler(storage: IDataStorage): Promise<void>
{
    console.log("\n\nScheduling data collection...");
    const scheduler: Scheduler = new Scheduler(storage);

    for (let aSchedule of schedules)
    {
        try
        {
            if (await scheduler.Schedule(aSchedule))
            {
                console.log(`Scheduled ${aSchedule.Title} to run every ${aSchedule.RunIntervalInMinutes} minutes.`);
            }
            else
            {
                console.log(`Failed to schedule ${aSchedule.Title}.`);
            }
        }
        catch (err)
        {
            console.log(`SCHEDULING ERROR for ${aSchedule.Title}:`);
            console.log(err);
        }
    }
}