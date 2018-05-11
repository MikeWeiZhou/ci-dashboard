import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * DefectsAverageDaysToResolution.
 * 
 * Defects - Average Days to resolution for bugs completed
 */
export class DefectsAverageDaysToResolutionKpiMapper extends KpiMapper
{
    public readonly Category: string = "";
    public readonly Title: string = "Defects - Average Days to resolve bugs";

    private _tablename: string = config.db.tablename.resolved_story_points;

    /**
     * Returns an array of SQL query strings given a date range.
     * @param {string} from date
     * @param {string} to date
     * @param {number} dateRange between from and to dates
     * @returns {string[]} an array of one or more SQL query string
     * @override
     */
    protected getQueryStrings(from: string, to: string, dateRange: number): string[]
    {
        return [`
            SELECT COUNT(*) AS 'COUNT',
                   IS_DEFAULT
            FROM ${this._tablename}
            WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY IS_DEFAULT
        `];
    }

    /**
     * Returns a KpiState given multiple JSON arrays containing queried data.
     * @param {Array<any>[]} jsonArrays One or more JSON array results (potentially empty arrays)
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     * @override
     */
    protected mapToKpiStateOrNull(jsonArrays: Array<any>[]): IKpiState|null
    {
        var jsonArray: Array<any> = jsonArrays[0];
        var values: Array<any> = [];
        var labels: Array<any> = [];

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            values.push(jsonArray[i].COUNT);
            labels.push(jsonArray[i].IS_DEFAULT);
        }

        return {
            data: [{
                values: values,
                labels: labels,
                type:   "pie"
            }],
            layout: {
                title: this.Title
            },
            frames: [],
            config: {}
        };
    }
}