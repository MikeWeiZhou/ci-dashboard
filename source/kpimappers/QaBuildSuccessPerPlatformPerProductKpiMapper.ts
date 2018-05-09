import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * QaBuildSuccessPerPlatformPerProduct.
 * 
 * QA Build Success vs Fail Per Platform Per Product.
 */
export class QaBuildSuccessPerPlatformPerProductKpiMapper extends KpiMapper
{
    private _tablename: string = config.db.tablename.qa_builds_and_runs_from_bamboo;
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
            SELECT PLATFORM_NAME, PRODUCT_NAME, 
                  (SELECT COUNT(*) FROM ${this._tablename}
                   WHERE BUILD_STATE = 'Successful' AND PLATFORM_CODE = a.PLATFORM_CODE 
                   AND PRODUCT_CODE = a.PRODUCT_CODE) / COUNT(*) as 'Success'
            FROM ${this._tablename} a
            WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY PLATFORM_NAME, PRODUCT_NAME
        `;
    }

    /**
     * Returns a KpiState or null given an array or single JSON object containing required data.
     * @param {Array<any>} jsonArray non-empty JSON array results containing data
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     */
    protected MapToKpiStateOrNull(jsonArray: Array<any>): IKpiState|null
    {
        var values: Array<any> = [];
        var labels: Array<any> = [];
        // testing for third value pushing
        var thirdValue : Array<any> = [];

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            values.push(jsonArray[i].Success);
            labels.push(jsonArray[i].PRODUCT_NAME);
            thirdValue.push(jsonArray[i].PLATFORM_NAME);
        }

        return {
            data: [{
                values: values,
                labels: labels,
                thirdValue: thirdValue,
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