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
            DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d") AS Date,
            AVG(CASE WHEN  BUILD_STATE = "Successful" THEN 1 ELSE 0 END) as Success
            FROM ${this._tablename}
            Where BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d"), PLATFORM_NAME 
            ORDER BY DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d");
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
        // Contains the labels (To fields to get a line chart)
        var windowsLabel: Array<any> = [];

        var linuxValue: Array<any> = [];
        var linuxLabel: Array<any> = [];

        var macValue: Array<any> = [];
        var macLabel: Array<any> = [];

        // Edit the stretch goal here
        const stretchGoal = 0.75;

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            // only insert the value the value is higher than 0%
            // to prevent sudden drops
            if (jsonArray[i].Success > 0) {
                if (jsonArray[i].PLATFORM_NAME == "Windows") {
                    windowsValue.push(jsonArray[i].Success);
                    windowsLabel.push(jsonArray[i].Date);
                } else if (jsonArray[i].PLATFORM_NAME == "Linux") {
                    linuxValue.push(jsonArray[i].Success);
                    linuxLabel.push(jsonArray[i].Date);
                } else { // It is a mac system
                    macValue.push(jsonArray[i].Success);
                    macLabel.push(jsonArray[i].Date);
                } // end inner if statement
            } // end outer if statement
        }

        return {
            data: [{
                x: windowsLabel,
                y: windowsValue,
                name: "Windows",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: linuxLabel,
                y: linuxValue,
                name: "Linux",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: macLabel,
                y: macValue,
                name: "Mac",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            }],
            layout: {
                title: this.Title,
                xaxis: {
                    title: "Date",
                    fixedrange: true
                },
                yaxis: {
                    title: 'Build Percentage',
                    tickformat: ',.0%',
                    fixedrange: true,
                    range: [0,1]
                },
                shapes: [{
                    type: 'line',
                    xref: 'paper',
                    x0: 0,
                    y0: stretchGoal,
                    x1: 1,
                    y1: stretchGoal,
                    line: {
                        color: 'rgb(255, 0, 0)',
                        width: 4,
                        dash:'dot'
                    }
                }]
            },
            frames: [],
            config: {displayModeBar: false}
        };
    }
}