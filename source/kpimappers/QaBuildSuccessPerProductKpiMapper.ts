import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * QaBuildSuccessPerPlatformPerProduct.
 * 
 * QA Build Success vs Fail Per Platform Per Product.
 */
export class QaBuildSuccessPerProductKpiMapper extends KpiMapper
{
    public readonly Category: string = "QA";
    public readonly Title: string = "QA Build Success Rate Per Product";

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
            SELECT PRODUCT_NAME, 
                  (SELECT COUNT(*) FROM ${this._tablename}
                   WHERE BUILD_STATE = 'Successful'
                   AND PRODUCT_CODE = a.PRODUCT_CODE AND
                   BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}') / COUNT(*) as 'Success'
            FROM ${this._tablename} a
            WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY PRODUCT_NAME
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
            values.push(jsonArray[i].Success);
            labels.push(jsonArray[i].PRODUCT_NAME);
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