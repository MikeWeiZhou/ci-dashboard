import * as moment from "moment"
import { IStorage } from "../storages/IStorage"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * KpiMapper.
 * 
 * Maps storage data to a specific type of KPI state object that can be consumed by Plotly.js.
 */
export abstract class KpiMapper
{
    private _storage: IStorage;

    /**
     * Constructor.
     * @param {IStorage} storage 
     */
    public constructor(storage: IStorage)
    {
        this._storage = storage;
    }

    /**
     * Returns a KPI state object that can be consumed by Plotly.js, or null.
     * @async
     * @param {Date} from date
     * @param {Date} to date
     * @returns {Promise<IKpiState|null>} IKpiState or null when errored
     */
    public async GetKpiStateOrNull(from: Date, to: Date): Promise<IKpiState|null>
    {
        var fromDate: string = moment(from).format(config.dateformat.mysql);
        var toDate: string = moment(to).format(config.dateformat.mysql);
        var sql: string = this.GetQueryString(fromDate, toDate);
        var jsonArrayResults: object = await this._storage.QueryResultsOrNull(sql);
        return (jsonArrayResults == null)
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