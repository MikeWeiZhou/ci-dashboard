import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const config = require("../../../config/config")

/**
 * QaBuildSuccessPerPlatformPerProduct.
 * 
 * QA Build Success vs Fail Per Platform Per Product.
 */
export class QaBuildSuccessPerPlatformKpiMapper extends KpiMapper
{
    public readonly Title: string = "QA Build Success Rate Per Platform";

    private _tablename: string = config.db.tablename.qa_builds_and_runs_from_bamboo;

    private _from: string;
    private _to: string;

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
        this._from = from;
        this._to = to;

        return [`
            SELECT PLATFORM_NAME, 
            DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d") AS Date,
            AVG(CASE WHEN  BUILD_STATE = "Successful" THEN 1 ELSE 0 END) as Success
            FROM ${this._tablename}
            Where BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d"), PLATFORM_NAME 
            ORDER BY DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d");
        `];
    }

    /**
     * Returns how many days are remaining in between two dates
     * @returns {var} a value on how many days left on an integer
     */
    protected getHowManyDaysLeft()
    {        
        var daysRemaining = moment(this._to).diff(this._from,'days');
        return daysRemaining;
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

        // Invalid; One data point on a scatter chart shows nothing
        if (jsonArray.length == 1)
        {
            return null;
        }

        // Declare how many points to plot
        var windowPoints = 15;
        var linuxPoints = 15;
        var macPoints = 15;

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
            if (jsonArray[i].PLATFORM_NAME == "Windows") {
                // get the starting point of the graph and add itin
                if (windowPoints != 0 && i-3 <= 0) {
                    windowsValue.push(jsonArray[i].Success);
                    windowsLabel.push(jsonArray[i].Date);
                } else if (windowPoints != 0) {
                    // If there is more points than how many days left to plot
                    if (this.getHowManyDaysLeft() < windowPoints) {
                        // plot it normally
                        windowsValue.push(jsonArray[i].Success);
                        windowsLabel.push(jsonArray[i].Date);
                    } else {
                        // implement crazy logic here
                        // do nothing for now
                    }
                } else if (windowPoints == 0 && i+3 >= jsonArray.length) {
                    // Once all the points are exhausted add the last point in
                    windowsValue.push(jsonArray[i].Success);
                    windowsLabel.push(jsonArray[i].Date);
                }
            } else if (jsonArray[i].PLATFORM_NAME == "Linux") {
                if (linuxPoints != 0) {
                    linuxValue.push(jsonArray[i].Success);
                    linuxLabel.push(jsonArray[i].Date);
                    --linuxPoints;
                }
            } else { // It is a mac system
                if (macPoints != 0) {
                    macValue.push(jsonArray[i].Success);
                    macLabel.push(jsonArray[i].Date);
                    --macPoints;
                }
            } // end inner if statement
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