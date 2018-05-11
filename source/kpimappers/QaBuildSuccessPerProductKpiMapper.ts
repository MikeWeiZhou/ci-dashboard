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
            DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d") AS Date, 
            AVG(CASE WHEN  BUILD_STATE = "Successful" THEN 1 ELSE 0 END) as Success 
            FROM ${this._tablename} 
            Where BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}' 
            GROUP BY DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d"), PRODUCT_NAME 
            ORDER BY DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d");
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
        // Contains the values (The data to plot the graph)
        var dxValue: Array<any> = [];
        var dxLabel: Array<any> = [];

        var fxValue: Array<any> = [];
        var fxLabel: Array<any> = [];

        var icValue: Array<any> = [];
        var icLabel: Array<any> = [];

        var mxValue : Array<any> = [];
        var mxLabel : Array<any> = [];

        // Edit the stretch goal here
        const stretchGoal = 0.75;

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            // only insert the value the value is higher than 0%
            // to prevent sudden drops
            if (jsonArray[i].Success > 0) {
                if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    dxValue.push(jsonArray[i].Success);
                    dxLabel.push(jsonArray[i].Date);
                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    fxValue.push(jsonArray[i].Success);
                    fxLabel.push(jsonArray[i].Date);
                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    icValue.push(jsonArray[i].Success);
                    icLabel.push(jsonArray[i].Date);
                } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                    mxValue.push(jsonArray[i].Success);
                    mxLabel.push(jsonArray[i].Date);
                } // end inner if statement
                // Or else ignore everything else that isn't those product names
            } // end outer if statement
        }

        return {
            data: [{
                x: dxLabel,
                y: dxValue,
                name: "DX",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: fxLabel,
                y: fxValue,
                name: "FX",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: icLabel,
                y: icValue,
                name: "IC",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            },
            {
                x: mxLabel,
                y: mxValue,
                name: "MX",
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