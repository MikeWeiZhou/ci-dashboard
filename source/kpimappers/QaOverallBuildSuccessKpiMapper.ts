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
    private _tablename: string = config.db.tablenames.qa_builds_and_runs_from_bamboo;
    private _title: string = "QA Overall Build Success vs Fail";

    /**
     * Returns SQL query string given a date range.
     * @param {string} from date
     * @param {string} to date
     * @returns {string} SQL query string
     * @override
     */
    protected GetQueryString(from: string, to: string): string
    {
        return `
            SELECT COUNT(*) AS 'COUNT',
                   IS_DEFAULT
            FROM ${this._tablename}
            WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY IS_DEFAULT
        `;
    }

    /**
     * Returns a KpiState given an array or single JSON object containing required data.
     * @param {Array<any>} jsonArray JSON results containing required data
     * @returns {IKpiState} IKpiState object
     * @override
     */
    protected MapToKpiState(jsonArray: Array<any>): IKpiState
    {
        var values: Array<any> = [];
        var labels: Array<any> = [];

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            values.push(jsonArray[i].COUNT);
            labels.push(jsonArray[i].IS_SUCCESS);
        }

        return {
            data: [{
                values: values,
                labels: labels,
                type:   "pie"
            }],
            layout: {
                title: this._title
            },
            frames: [],
            config: {}
        };
    }
}