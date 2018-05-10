import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * QaOverallBuildSuccessKpiMapper.
 * 
 * QA Overall Build Success vs Fail.
 */
export class QaOverallBuildSuccessKpiMapper extends KpiMapper
{
    public readonly Category: string = "Quality Assurance";
    public readonly Title: string = "QA Overall Build Success vs Fail";

    private _tablename: string = config.db.tablename.qa_builds_and_runs_from_bamboo;

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
        SELECT 
            (SELECT COUNT(*)
            FROM ${this._tablename} 
            WHERE BUILD_STATE = 'Successful')
            / COUNT(*) AS 'Success'
        FROM ${this._tablename}
        WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
    `;
    }

    /**
     * Returns a KpiState or null given an array or single JSON object containing required data.
     * @param {Array<any>} jsonArray non-empty JSON array results containing data
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     * @override
     */
    protected mapToKpiStateOrNull(jsonArray: Array<any>): IKpiState|null
    {
        var values: Array<any> = [];
        var labels: Array<any> = ["Overall"];

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            values.push(jsonArray[i].Success);
            //labels.push(jsonArray[i].PLATFORM_NAME);
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