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
            SELECT 
                (SELECT COUNT(*)
                FROM ${this._tablename} 
                WHERE BUILD_STATE = 'Successful' AND 
                BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}')
                / COUNT(*) AS 'Success',
                (SELECT COUNT(*)
                FROM ${this._tablename} 
                WHERE BUILD_STATE = 'Failed' AND 
                BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}')
                / COUNT(*) AS 'Failed'
            FROM ${this._tablename}
            WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
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
        var labels: Array<any> = ["Overall Build Success","Overall Build Failure"];

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            values.push(jsonArray[i].Success);
            //labels.push(jsonArray[i].PLATFORM_NAME);
            values.push(jsonArray[i].Failed);
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
            config: {displayModeBar: false}
        };
    }
}