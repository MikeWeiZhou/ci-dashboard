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
     * Returns a KPI state object that can be consumed by Plotly.js, or null.
     * @async
     * @param {Date} from date
     * @param {Date} to date
     * @returns {Promise<IKpiState|null>} IKpiState or null when errored
     * @throws {Error} Error if storage error
     */
    public async GetKpiStateOrNull(from: Date, to: Date): Promise<IKpiState|null>
    {
        var fromDate: string = moment(from).format(config.dateformat.mysql);
        var toDate: string = moment(to).format(config.dateformat.mysql);
        var sql: string = this.GetQueryString(fromDate, toDate);
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
            : this.MapToKpiState(jsonArrayResults);
    }

    /**
     * Returns SQL query string given a date range.
     * @param {string} from date
     * @param {string} to date
     * @returns {string} SQL query string
     */
    protected abstract GetQueryString(from: string, to: string): string;

    /**
     * Returns a KpiState given an array or single JSON object containing required data.
     * @param {object} jsonArray JSON results containing required data
     * @returns {IKpiState} IKpiState object
     */
    protected abstract MapToKpiState(jsonArray: object): IKpiState;
}