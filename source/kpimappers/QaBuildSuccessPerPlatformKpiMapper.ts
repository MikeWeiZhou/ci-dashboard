import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * QaBuildSuccessPerPlatformPerProduct.
 * 
 * QA Build Success vs Fail Per Platform Per Product.
 */
export class QaBuildSuccessPerPlatformKpiMapper extends KpiMapper
{
    public readonly Category: string = "";
    public readonly Title: string = "QA Build Success Rate Per Platform";

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
            SELECT PLATFORM_NAME, 
                  (SELECT COUNT(*) FROM ${this._tablename}
                   WHERE BUILD_STATE = 'Successful'
                   AND PRODUCT_CODE = a.PRODUCT_CODE AND 
                   BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}') 
                   / COUNT(*) as 'Success'
            FROM ${this._tablename} a
            WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY PLATFORM_NAME
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
        var labels: Array<any> = [];

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            values.push(jsonArray[i].Success);
            labels.push(jsonArray[i].PLATFORM_NAME);
        }

        return {
            data: [{
                // values represent the y axis
                values: values,
                // labels represent the x value
                labels: labels,
                type:   "pie"
            }],
            layout: {
                title: this.Title,
                barmode: 'group'
            },
            frames: [],
            config: {}
        };
    }
}