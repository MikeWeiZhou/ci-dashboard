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
     * @param {object} jsonArray JSON results containing required data
     * @returns {IKpiState} IKpiState object
     * @override
     */
    protected MapToKpiState(jsonArray: object): IKpiState
    {
        return {
            data: [{
                values: [jsonArray[0].COUNT, jsonArray[1].COUNT],
                labels: [jsonArray[0].IS_SUCCESS, jsonArray[1].IS_SUCCESS],
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