import IStorage from "../storages/MySqlStorage"
import { IKpiState } from "./IKpiState"

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
        var sql: string = this.GetQueryString(from, to);
        var jsonArrayResults: object = await this._storage.QueryOrNull(sql);
        return (jsonArrayResults == null)
            ? null
            : this.MapToKpiState(jsonArrayResults);
    }

    /**
     * Returns SQL query string given a date range.
     * @param {Date} from date
     * @param {Date} to date
     * @returns {string} SQL query string
     */
    protected abstract GetQueryString(from: Date, to: Date): string;

    /**
     * Returns a KpiState given an array or single JSON object containing required data.
     * @param {object} jsonArray JSON results containing required data
     * @returns {IKpiState} IKpiState object
     */
    protected abstract MapToKpiState(jsonArray: object): IKpiState;
}