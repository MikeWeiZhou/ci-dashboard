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
    public abstract readonly Category: string;
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
        var toDate: moment.Moment = moment.utc(to);
        var dateRange: number = toDate.diff(fromDate, "days");
        var sql: string = this.getQueryString(fromDate.format(config.dateformat.mysql), toDate.format(config.dateformat.mysql),dateRange);
        var jsonArrayResults: Array<any>;
        try
        {
            jsonArrayResults = await this._dataStorage.Query(sql);
        }
        catch (err)
        {
            throw err;
        }
        return (jsonArrayResults.length == 0)
            ? null
            : this.mapToKpiStateOrNull(jsonArrayResults);
    }

    /**
     * Returns SQL query string given a date range.
     * @param {string} from date
     * @param {string} to date
     * @param {number} dateRange between from and to dates
     * @returns {string} SQL query string
     */
    protected abstract getQueryString(from: string, to: string, dateRange: number): string;

    /**
     * Returns a KpiState or null given an array or single JSON object containing required data.
     * @param {Array<any>} jsonArray non-empty JSON array results containing data
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     */
    protected abstract mapToKpiStateOrNull(jsonArray: Array<any>): IKpiState|null;
}