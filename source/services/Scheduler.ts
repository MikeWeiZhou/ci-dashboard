import * as moment from "moment"
import { IDataStorage } from "../datastorages/IDataStorage"
import { ISchedule } from "./ISchedule"
import { IDataInterface } from "../datainterfaces/IDataInterface"
import { TransformStream } from "../streams/TransformStream"
import { WriteStream } from "../streams/WriteStream"
import { Log } from "../Log"
const config = require("../../config/config")

/**
 * Scheduler.
 * 
 * Schedules different IDataCollectors and IDataInterfaces to run at specified intervals.
 */
export class Scheduler
{
    private _dataStorage: IDataStorage;
    private _schedules: Array<IDataInterface>;

    /**
     * Constructor.
     * @param {IDataStorage} dataStorage to write new data
     */
    public constructor(dataStorage: IDataStorage)
    {
        this._dataStorage = dataStorage;
        this._schedules = [];
    }

    /**
     * Schedules a given schedule if valid.
     * @async
     * @param {ISchedule} schedule to run
     * @returns {Promise<boolean>} true if scheduled, false if not
     * @throws {Error} error if errored
     */
    public async Schedule(schedule: ISchedule): Promise<boolean>
    {
        // Ensure no duplicate IDataInterface scheduled
        for (let i: number = 0; i < this._schedules.length; ++i)
        {
            if (this._schedules[i] == schedule.DataInterface)
            {
                return false;
            }
        }

        // Ensure only valid schedules run
        var validSchedule: ISchedule|null = await this.makeValidScheduleOrNull(schedule);
        if (validSchedule)
        {
            this._schedules.push(schedule.DataInterface);
            this.runSchedule(validSchedule);
            return true;
        }

        return false;
    }

    /**
     * Runs the given schedule and re-schedules it to run again at specified interval.
     * @param {ISchedule} schedule to run
     */
    private runSchedule(schedule: ISchedule): void
    {
        // Schedule to run again
        var _this: Scheduler = this;
        setTimeout(async () =>
        {
            var newSchedule: ISchedule =
            {
                Title: schedule.Title,
                DataCollector: schedule.DataCollector,
                DataInterface: schedule.DataInterface,
                RunIntervalInMinutes: schedule.RunIntervalInMinutes,
                DataFromDate: await _this.getLastDataToDateFromDb(schedule.DataInterface),
                DataToDate: moment.utc(new Date()).add(schedule.RunIntervalInMinutes, 'm').toDate()
            };
            _this.runSchedule(newSchedule);
        }, schedule.RunIntervalInMinutes * 1000 * 60);

        console.log(`Running schedule: ${schedule.Title}`);

        schedule.DataCollector.Initialize(schedule.DataFromDate as Date, schedule.DataToDate as Date);
        schedule.DataCollector.GetStream()
            .pipe(new TransformStream(schedule.DataInterface))
            .pipe(new WriteStream(this._dataStorage, schedule.DataInterface))
            .on("finish", async () =>
            {
                console.log(`Finished running data collection for schedule ${schedule.Title}`);
                if (!await _this.updateDataToDateInDb(schedule))
                {
                    console.log("BUT FAILED TO update dates info in data source tracking table");
                }
            });
    }

    /**
     * Attempts to make a given schedule valid by adding the date ranges.
     * @async
     * @param {ISchedule} schedule to validate
     * @returns {ISchedule|null} a valid ISchedule or null
     * @throws {Error} error if errored
     */
    private async makeValidScheduleOrNull(schedule: ISchedule): Promise<ISchedule|null>
    {
        if (!(0 <= schedule.RunIntervalInMinutes && schedule.RunIntervalInMinutes <= 9999))
        {
            return null;
        }

        var lastDataToDate: any = await this.getLastDataToDateFromDb(schedule.DataInterface);
        var newSchedule: ISchedule =
        {
            Title: schedule.Title,
            DataCollector: schedule.DataCollector,
            DataInterface: schedule.DataInterface,
            RunIntervalInMinutes: schedule.RunIntervalInMinutes,
            DataFromDate: schedule.DataFromDate || lastDataToDate,
            DataToDate: schedule.DataToDate || new Date()
        };

        if ((newSchedule.DataFromDate as Date) > (newSchedule.DataToDate as Date))
        {
            return null;
        }

        // There is a gap between the last data TO_DATE and the scheduled FROM_DATE
        // new scheduled FROM_DATE must <= database's TO_DATE
        if (newSchedule.DataFromDate as Date > lastDataToDate)
        {
            return null;
        }

        return newSchedule;
    }

    /**
     * Updates database with the latest To Date from schedule.
     * @async
     * @param {ISchedule} schedule containing latest to date info
     * @returns {Promise<boolean>} true if update success, false otherwise
     */
    private async updateDataToDateInDb(schedule: ISchedule): Promise<boolean>
    {
        var results: any;
        var date: string = moment.utc(schedule.DataToDate).format(config.dateformat.mysql);
        var query: string = `UPDATE ${config.db.tablename.data_source_tracker}
                             SET TO_DATE = '${date}'
                             WHERE TABLE_NAME = '${schedule.DataInterface.TableName}'`;
        try
        {
            results = await this._dataStorage.Query(query);
        }
        catch (err)
        {
            Log(err, `Failed to update tracking information for schedule ${schedule.Title}\n\nSQL Query: ${query}`);
            return false;
        }

        if (results.affectedRows == 0)
        {
            var err: Error = new Error
            (`
                Table ${schedule.DataInterface.TableName} not in data source tracking table.
                SQL Query: ${query}
            `);
            Log(err, `SQL Query: ${query}`);
            return false;
        }

        return true;
    }

    /**
     * Returns the last TO_DATE of the given IDataInterface from the database.
     * @async
     * @param {IDataInterface} dataInterface table to get latest To Date info from
     * @throws {Error} error if errored
     */
    private async getLastDataToDateFromDb(dataInterface: IDataInterface): Promise<Date>
    {
        var results: any;
        var query: string = `SELECT FROM_DATE, TO_DATE
                            FROM ${config.db.tablename.data_source_tracker}
                            WHERE TABLE_NAME = '${dataInterface.TableName}'`;
        try
        {
            results = await this._dataStorage.Query(query);
        }
        catch (err)
        {
            Log(err, `Errored when calling getLastDataToDateFromDb in Scheduler\n\nSQL Query: ${query}`);
            throw err;
        }

        // No results. Recommend running "npm run setup" again.
        if (results.length == 0)
        {
            var err: Error = new Error(`${dataInterface.TableName} table not tracked.`);
            Log(err, `SQL Query: ${query}`);
            throw err;
        }

        return new Date(results.TO_DATE);
    }
}