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
    private _title: string = "QA Build Success Rate Per Platform Per Product";

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
            GROUP BY PRODUCT_NAME, PLATFORM_NAME
        `;
    }

    /**
     * Returns a KpiState or null given an array or single JSON object containing required data.
     * @param {Array<any>} jsonArray non-empty JSON array results containing data
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     */
    protected MapToKpiStateOrNull(jsonArray: Array<any>): IKpiState|null
    {
        // Contains the values (To plot the graph)
        var windows: Array<any> = [];
        // Contains the labels (To get a group bar)
        var windowsLabel: Array<any> = [];

        var linux: Array<any> = [];
        var linuxLabel: Array<any> = [];

        var mac: Array<any> = [];
        var macLabel: Array<any> = [];

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            if (jsonArray[i].PLATFORM_NAME == "Windows") {
                windows.push(jsonArray[i].Success);
                windowsLabel.push(jsonArray[i].PRODUCT_NAME);
            } else if (jsonArray[i].PLATFORM_NAME == "Linux") {
                linux.push(jsonArray[i].Success);
                linuxLabel.push(jsonArray[i].PRODUCT_NAME);
            } else { // It is a mac system
                mac.push(jsonArray[i].Success);
                macLabel.push(jsonArray[i].PRODUCT_NAME);
            }
        }

        return {
            data: [{
                x: windowsLabel,
                y: windows,
                name: "Windows",
                type: "bar"
            },
            {
                x: linuxLabel,
                y: linux,
                name: "Linux",
                type: "bar"
            }],
            layout: {
                title: this._title
            },
            frames: [],
            config: {}
        };
    }
}