import * as moment from "moment"
import { IDataStorage } from "../datastorages/IDataStorage"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * KpiMapper.
 * 
 * Maps storage data to a specific type of KPI state object that can be consumed by Plotly.js.
 */
export abstract class KpiMapper
{
    public abstract readonly Title: string;
    private _dataStorage: IDataStorage;

    /**
     * Constructor.
     * @param {IDataStorage} dataStorage
     */
    public constructor(dataStorage: IDataStorage)
    {
        this._dataStorage = dataStorage;
    }

    /**
     * Returns a KPI state object that can be consumed by Plotly.js, or null when insufficient or no data.
     * @async
     * @param {Date} from date
     * @param {Date} to date
     * @returns {Promise<IKpiState|null>} IKpiState or null when insufficient or no data
     * @throws {Error} Error if storage error
     */
    public async GetKpiStateOrNull(from: Date, to: Date): Promise<IKpiState|null>
    {
        var fromDate: moment.Moment = moment.utc(from);
        var toDate: moment.Moment = moment.utc(to).hour(23).minute(59).second(59);
        var dateRange: number = toDate.diff(fromDate, "days") + 1;
        var sqls: string[] = this.getQueryStrings(fromDate.format(config.dateformat.mysql), toDate.format(config.dateformat.mysql), dateRange);
        var jsonArrayResults: Array<any>[] = [];
        try
        {
            for (let sql of sqls)
            {
                jsonArrayResults.push(await this._dataStorage.Query(sql));
            }
        }
        catch (err)
        {
            throw err;
        }
        return this.mapToKpiStateOrNull(jsonArrayResults);
    }

    /**
     * Returns an array of SQL query strings given a date range.
     * @param {string} from date
     * @param {string} to date
     * @param {number} dateRange between from and to dates
     * @returns {string[]} an array of one or more SQL query string
     */
    protected abstract getQueryStrings(from: string, to: string, dateRange: number): string[];

    /**
     * Returns a KpiState given multiple JSON arrays containing queried data.
     * @param {Array<any>[]} jsonArrays One or more JSON array results (potentially empty arrays)
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     */
    protected abstract mapToKpiStateOrNull(jsonArrays: Array<any>[]): IKpiState|null;
}