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
    public readonly Category: string = "QA";
    public readonly Title: string = "QA Build Success Rate Per Platform Per Product";

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
            SELECT PLATFORM_NAME, PRODUCT_NAME, 
                  (SELECT COUNT(*) FROM ${this._tablename}
                   WHERE BUILD_STATE = 'Successful' AND PLATFORM_CODE = a.PLATFORM_CODE 
                   AND PRODUCT_CODE = a.PRODUCT_CODE AND
                   BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}') / COUNT(*) as 'Success'
            FROM ${this._tablename} a
            WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY PRODUCT_NAME, PLATFORM_NAME
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
        // Contains the values (The data to plot the graph)
        var windowsValue: Array<any> = [];
        // Contains the labels (To fields to get a group bar)
        var windowsLabel: Array<any> = [];

        var linuxValue: Array<any> = [];
        var linuxLabel: Array<any> = [];

        var macValue: Array<any> = [];
        var macLabel: Array<any> = [];

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            if (jsonArray[i].PLATFORM_NAME == "Windows") {
                windowsValue.push(jsonArray[i].Success);
                windowsLabel.push(jsonArray[i].PRODUCT_NAME);
            } else if (jsonArray[i].PLATFORM_NAME == "Linux") {
                linuxValue.push(jsonArray[i].Success);
                linuxLabel.push(jsonArray[i].PRODUCT_NAME);
            } else { // It is a mac system
                macValue.push(jsonArray[i].Success);
                macLabel.push(jsonArray[i].PRODUCT_NAME);
            }
        }

        return {
            data: [{
                x: windowsLabel,
                y: windowsValue,
                name: "Windows",
                type: "bar"
            },
            {
                x: linuxLabel,
                y: linuxValue,
                name: "Linux",
                type: "bar"
            },
            {
                x: macLabel,
                y: macValue,
                name: "Mac",
                type: "bar"
            }],
            layout: {
                title: this.Title,
                xaxis: {
                    title: "Build Percentage",
                    fixedrange: true
                },
                yaxis: {
                    title: 'Products',
                    tickformat: ',.0%',
                    fixedrange: true,
                    range: [0,1]
                }
            },
            frames: [],
            config: {displayModeBar: false}
        };
    }
}