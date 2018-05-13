import * as moment from "moment"
import { AvgPointsFunctions } from "./Functions/AvgPointsFunctions"
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
    public readonly Title: string = "QA Build Success Rate Per Product";

    private _tablename: string = config.db.tablename.qa_builds_and_runs_from_bamboo;

    private _from: string;
    private _to: string;

    // Start with splitting data points by how many days 
    private dataPointsToPlot = 0;

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
        var avgFunctions = new AvgPointsFunctions();

        // Edit the target and stretch goals here in decimal percantages
        const targetGoal = 0.70
        const stretchGoal = 0.90;

        // Invalid; One data point on a scatter chart shows nothing
        if (jsonArray.length == 1)
        {
            return null;
        }

        // Declare how many points to plot
        // Will always plot the first and last and in between will be
        // a number that is equal to or lower than points specified
        var plottingPoints = 30;

        var dxPointsToAdd = 0;
        var fxPointsToAdd = 0;
        var icPointsToAdd = 0;
        var mxPointsToAdd = 0;

        // Contains the values (The data to plot the graph)
        var dxValue: Array<any> = [];
        var dxLabel: Array<any> = [];
        var dxAverage: Array<any> = [];

        var fxValue: Array<any> = [];
        var fxLabel: Array<any> = [];
        var fxAverage: Array<any> = [];

        var icValue: Array<any> = [];
        var icLabel: Array<any> = [];
        var icAverage: Array<any> = [];

        var mxValue: Array<any> = [];
        var mxLabel: Array<any> = [];
        var mxAverage: Array <any> = []

        // 30 day difference example
        var getDaysLeft = avgFunctions.getHowManyDaysLeft(this._from, this._to);

        // Find out how many data points to split across using Math.Floor
        this.dataPointsToPlot = Math.floor((getDaysLeft/plottingPoints));

        // Don't edit these values
        var dxFirstPush = false;
        var fxFirstPush = false;
        var icFirstPush = false;
        var mxFirstPush = false;
        
        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                // get the starting point of the graph and add it in
                if (!dxFirstPush) {
                    dxValue.push(jsonArray[i].Success);
                    dxLabel.push(jsonArray[i].Date);
                    dxFirstPush = true;
                } else {
                     // If there is more points than how many days left to plot
                     if (getDaysLeft < plottingPoints) {
                         // Plot it normally
                         dxValue.push(jsonArray[i].Success);
                         dxLabel.push(jsonArray[i].Date);
                         dxFirstPush = true;
                     } else {
                        dxAverage.push(jsonArray[i].Success);
                        ++dxPointsToAdd;
                        // once it meets the specific points then it'll add it to the value and label
                        // or if it is the final point
                        if ((dxPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                            var averageValue = avgFunctions.getAveragePercentage(dxAverage);
                            dxValue.push(averageValue);
                            dxLabel.push(jsonArray[i].Date);

                            // clean everything up once it's over
                            // resets the points to 0
                            dxPointsToAdd = 0;

                            // clean data conained by popping from the array
                            avgFunctions.cleanAverageData(dxAverage);
                        }
                     }
                }
            } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                 // get the starting point of the graph and add it in
                 if (!fxFirstPush) {
                    fxValue.push(jsonArray[i].Success);
                    fxLabel.push(jsonArray[i].Date);
                    fxFirstPush = true;
                } else {
                     // If there is more points than how many days left to plot
                     if (getDaysLeft < plottingPoints) {
                         // Plot it normally
                         fxValue.push(jsonArray[i].Success);
                         fxLabel.push(jsonArray[i].Date);
                         fxFirstPush = true;
                     } else {
                        fxAverage.push(jsonArray[i].Success);
                        ++fxPointsToAdd;
                        // once it meets the specific points then it'll add it to the value and label
                        // or if it is the final point
                        if ((fxPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                            var averageValue = avgFunctions.getAveragePercentage(fxAverage);
                            fxValue.push(averageValue);
                            fxLabel.push(jsonArray[i].Date);

                            // clean everything up once it's over
                            // resets the points to 0
                            fxPointsToAdd = 0;

                            // clean data conained by popping from the array
                            avgFunctions.cleanAverageData(fxAverage);
                        }
                     }
                }
            } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                // get the starting point of the graph and add it in
                if (!icFirstPush) {
                    icValue.push(jsonArray[i].Success);
                    icLabel.push(jsonArray[i].Date);
                    icFirstPush = true;
                } else {
                     // If there is more points than how many days left to plot
                     if (getDaysLeft < plottingPoints) {
                         // Plot it normally
                         icValue.push(jsonArray[i].Success);
                         icLabel.push(jsonArray[i].Date);
                         icFirstPush = true;
                     } else {
                        icAverage.push(jsonArray[i].Success);
                        ++icPointsToAdd;
                        // once it meets the specific points then it'll add it to the value and label
                        // or if it is the final point
                        if ((icPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                            var averageValue = avgFunctions.getAveragePercentage(icAverage);
                            icValue.push(averageValue);
                            icLabel.push(jsonArray[i].Date);

                            // clean everything up once it's over
                            // resets the points to 0
                            icPointsToAdd = 0;

                            // clean data conained by popping from the array
                            avgFunctions.cleanAverageData(icAverage);
                        }
                     }
                }
            } else if (jsonArray[i].PRODUCT_NAME == "***REMOVED***") {
                 // get the starting point of the graph and add it in
                 if (!mxFirstPush) {
                    mxValue.push(jsonArray[i].Success);
                    mxLabel.push(jsonArray[i].Date);
                    mxFirstPush = true;
                } else {
                     // If there is more points than how many days left to plot
                     if (getDaysLeft < plottingPoints) {
                         // Plot it normally
                         mxValue.push(jsonArray[i].Success);
                         mxLabel.push(jsonArray[i].Date);
                         mxFirstPush = true;
                     } else {
                        mxAverage.push(jsonArray[i].Success);
                        ++mxPointsToAdd;
                        // once it meets the specific points then it'll add it to the value and label
                        // or if it is the final point
                        if ((mxPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                            var averageValue = avgFunctions.getAveragePercentage(mxAverage);
                            mxValue.push(averageValue);
                            mxLabel.push(jsonArray[i].Date);

                            // clean everything up once it's over
                            // resets the points to 0
                            mxPointsToAdd = 0;

                            // clean data conained by popping from the array
                            avgFunctions.cleanAverageData(mxAverage);
                        }
                     }
                }
            } // end inner if statement
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