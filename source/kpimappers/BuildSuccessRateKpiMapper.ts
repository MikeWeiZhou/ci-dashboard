import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * BuildSuccessRateKpiMapper.
 */
export class BuildSuccessRateKpiMapper extends KpiMapper
{
    public readonly Category: string = "Product Delivery";
    public readonly Title: string = "Build Success Rate";

    private readonly _tableName: string = config.db.tablename.qa_builds_and_runs_from_bamboo;

    /**
     * Returns SQL query string given a date range.
     * @param {string} from date
     * @param {string} to date
     * @param {number} dateRange between from and to dates
     * @returns {string} SQL query string
     * @override
     */
    protected getQueryString(from: string, to: string, dateRange: number): string
    {
        return `
            SELECT COUNT(*) AS 'COUNT'
                  ,IS_SUCCESS
                  ,BUILD_STATE
                  ,DATE_FORMAT(T.BUILD_COMPLETED_DATE, '%Y-%m') AS 'PERIOD'
            FROM ${this._tableName} T
            WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY PERIOD
                    ,IS_SUCCESS
                    ,BUILD_STATE
            ORDER BY PERIOD     ASC
                    ,IS_SUCCESS DESC
        `;
        /*+-------+------------+-------------+---------+
          | COUNT | IS_SUCCESS | BUILD_STATE | PERIOD  |
          +-------+------------+-------------+---------+
          |   340 |          1 | Successful  | 2017-01 |
          |   355 |          0 | Failed      | 2017-01 |
          |   287 |          1 | Successful  | 2017-02 |
          |   343 |          0 | Failed      | 2017-02 |
          |   337 |          1 | Successful  | 2017-03 |
          |   316 |          0 | Failed      | 2017-03 |
          +-------+------------+-------------+---------+*/
    }

    /**
     * Returns a KpiState or null given an array or single JSON object containing required data.
     * @param {Array<any>} jsonArray non-empty JSON array results containing data
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     * @override
     */
    protected mapToKpiStateOrNull(jsonArray: Array<any>): IKpiState|null
    {
        var x: Array<any> = [];
        var y: Array<any> = [];

        // Assumes there's at least 2 records with identical periods
        for (let i: number = 0; i < jsonArray.length; i += 2)
        {
            x.push(jsonArray[i].PERIOD);

            // Assumes first one is always a count of IS_SUCCESS = 1
            y.push(jsonArray[i].COUNT / (jsonArray[i+1].COUNT + jsonArray[i].COUNT));
        }

        return {
            data: [{
                x:    x,
                y:    y,
                type: "scatter",
                mode: "lines",
                line: {
                    "shape":     "spline",
                    "smoothing": 1.3
                }
            }],
            layout: {
                title: this.Title
            },
            frames: [],
            config: {}
        };
    }
}