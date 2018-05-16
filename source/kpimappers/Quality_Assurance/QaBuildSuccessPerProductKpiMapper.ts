import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const config = require("../../../config/config")

/**
 * QaBuildSuccessPerPlatformPerProduct.
 * 
 * QA Build Success vs Fail Per Platform Per Product.
 */
export class QaBuildSuccessPerProductKpiMapper extends KpiMapper
{
    // Title name for graph
    public readonly Title: string = "QA Build Success Rate Per Product";

    // Table name for SQL calling
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
        return [
        `
        WITH DAILY_AVG_SUCCESS_RATE AS
        (
            SELECT PRODUCT_NAME, Date_format(build_completed_date, "%Y-%m-%d") AS 'BUILD_DATE'
                ,AVG(IS_SUCCESS) AS 'SUCCESS_RATE'
            FROM ${this._tablename}
            WHERE BUILD_COMPLETED_DATE BETWEEN DATE_ADD('${from}', INTERVAL -29 DAY) AND '${to}' 
            GROUP BY BUILD_DATE, PRODUCT_NAME
            ORDER BY BUILD_DATE
        )
        
            SELECT T1.PRODUCT_NAME, T1.BUILD_DATE AS 'DATE'
                ,AVG(T2.SUCCESS_RATE) AS 'SUCCESS_RATE'
            FROM DAILY_AVG_SUCCESS_RATE T1
            LEFT JOIN DAILY_AVG_SUCCESS_RATE T2
            ON T1.PRODUCT_NAME = T2.PRODUCT_NAME AND T2.BUILD_DATE BETWEEN
                DATE_ADD(T1.BUILD_DATE, INTERVAL -29 DAY) AND T1.BUILD_DATE
            WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY DATE, PRODUCT_NAME
            ORDER BY DATE;
        `,
        `
            SELECT PRODUCT_NAME 
            FROM ${this._tablename}
            GROUP BY PRODUCT_NAME
            ORDER BY PRODUCT_NAME;
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
        const productArray : Array<any> = jsonArrays[1];
        // productArray returns the following
        // ***REMOVED***, ***REMOVED***, ***REMOVED***, ***REMOVED***, DM

        // Edit the target and stretch goals here in decimal percantages
        const targetGoal = 0.55
        const stretchGoal = 0.70;

        // Invalid; One data point on a scatter chart shows nothing
        if (jsonArray.length == 1)
        {
            return null;
        }

        // Values are as followings
        // DX = Device [0]
        // DM = DM (Not used) [1]
        // FX = ***REMOVED*** [2]
        // IC = ***REMOVED*** [3]
        // MX = ***REMOVED*** [4]

        // Contains the values (The data to plot the graph)
        var dxValue: Array<any> = [];
        // Contains the labels (To fields to get a line chart)
        var dxLabel: Array<any> = [];

        var fxValue: Array<any> = [];
        var fxLabel: Array<any> = [];

        var icValue: Array<any> = [];
        var icLabel: Array<any> = [];

        var mxValue: Array<any> = [];
        var mxLabel: Array<any> = [];
        
        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            if (jsonArray[i].PRODUCT_NAME == productArray[0].PRODUCT_NAME) {
                // Add the value and labels from the query and push it in the array
                dxValue.push(jsonArray[i].SUCCESS_RATE);
                dxLabel.push(jsonArray[i].DATE);
                
            } else if (jsonArray[i].PRODUCT_NAME == productArray[2].PRODUCT_NAME) {

                fxValue.push(jsonArray[i].SUCCESS_RATE);
                fxLabel.push(jsonArray[i].DATE);
                
            } else if (jsonArray[i].PRODUCT_NAME == productArray[3].PRODUCT_NAME) {

                icValue.push(jsonArray[i].SUCCESS_RATE);
                icLabel.push(jsonArray[i].DATE);
                
            } else if (jsonArray[i].PRODUCT_NAME == productArray[4].PRODUCT_NAME) {
                mxValue.push(jsonArray[i].SUCCESS_RATE);
                mxLabel.push(jsonArray[i].DATE);
            }

        } // end for statement

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
                    y0: targetGoal,
                    x1: 1,
                    y1: targetGoal,
                    line: {
                        color: 'rgb(0, 255, 0)',
                        width: 4,
                        dash:'dot'
                    }
                },
                {
                    type: 'line',
                    xref: 'paper',
                    x0: 0,
                    y0: stretchGoal,
                    x1: 1,
                    y1: stretchGoal,
                    line: {
                        color: 'gold',
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