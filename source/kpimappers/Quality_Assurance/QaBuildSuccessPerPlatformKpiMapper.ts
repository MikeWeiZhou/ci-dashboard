import * as moment from "moment"
import { avgPointsFunctions } from "./Functions/avgPointsFunctions"
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
    // Start with splitting data points by 1 days 
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
     * Returns a KpiState given multiple JSON arrays containing queried data.
     * @param {Array<any>[]} jsonArrays One or more JSON array results (potentially empty arrays)
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     * @override
     */
    protected mapToKpiStateOrNull(jsonArrays: Array<any>[]): IKpiState|null
    {
        var jsonArray: Array<any> = jsonArrays[0];
        var avgFunctions = new avgPointsFunctions();

        // Invalid; One data point on a scatter chart shows nothing
        if (jsonArray.length == 1)
        {
            return null;
        }

        // Declare how many points to plot
        // Will always plot the first and last and in between will be
        // a number that is equal to or lower than points specified
        var plottingPoints = 30;

        var windowsPointsToAdd = 0;
        var linuxPointsToAdd = 0;
        var macPointsToAdd = 0;

        // Contains the values (The data to plot the graph)
        var windowsValue: Array<any> = [];
        // Contains the labels (To fields to get a line chart)
        var windowsLabel: Array<any> = [];
        // To help contain the values and spit out an average
        var windowsAverage: Array<any> = [];

        var linuxValue: Array<any> = [];
        var linuxLabel: Array<any> = [];
        var linuxAverage: Array<any> = [];

        var macValue: Array<any> = [];
        var macLabel: Array<any> = [];
        var macAverage: Array<any> = [];

        // Edit the stretch goal here
        const stretchGoal = 0.75;

        // 30 day difference example
        var getDaysLeft = avgFunctions.getHowManyDaysLeft(this._from, this._to);

        // Find out how many data points to split across using Math.Floor
        this.dataPointsToPlot = Math.floor((getDaysLeft/plottingPoints));

        var windowFirstPush = false;
        var linuxFirstPush = false;
        var macFirstPush = false;

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            if (jsonArray[i].PLATFORM_NAME == "Windows") {
                // get the starting point of the graph and add it in

                // Need to figure out how to do it dynamically
                if (!windowFirstPush) {
                    windowsValue.push(jsonArray[i].Success);
                    windowsLabel.push(jsonArray[i].Date);
                    windowFirstPush = true;
                } else if (moment(this._to).diff(jsonArray[i].Date,'days') == 0 ){
                    // Once all the points are exhausted add the last point in if it isn't 0
                    // Need to figure out how to do it dynmically too
                    windowsValue.push(jsonArray[i].Success);
                    windowsLabel.push(jsonArray[i].Date);
                } else {
                    // If there is more points than how many days left to plot
                    if (getDaysLeft < plottingPoints) {
                        // plot it normally
                        windowsValue.push(jsonArray[i].Success);
                        windowsLabel.push(jsonArray[i].Date);
                    } else {
                        // implement crazy logic here
                        // what the crazy logic should do is it'll get the average of the dataPointsToPlot
                        // and plot that as the date that's the 1 over the middle date if dataPointsToPlot is even IDEALLY
                        // otherwise plot at exactly the middle date if dataPointsToPlot is odd IDEALLY
                        windowsAverage.push(jsonArray[i].Success);
                        ++windowsPointsToAdd;
                        // once it meets the specific points then it'll add it to the value and label
                        if (windowsPointsToAdd % this.dataPointsToPlot == 0) {
                            var averageValue = avgFunctions.getAveragePercentage(windowsAverage);
                            windowsValue.push(averageValue);
                            windowsLabel.push(jsonArray[i].Date);

                            // clean everything up once it's over
                            // resets the points to 0
                            windowsPointsToAdd = 0;

                            // clean the data conained by popping from the array
                            avgFunctions.cleanAverageData(windowsAverage);

                        } // end if statement
                    } // end else statement
                } // end crazy if statement

            } else if (jsonArray[i].PLATFORM_NAME == "Linux") {
                // get the starting point of the graph and add it in
                if (!linuxFirstPush) {
                    linuxValue.push(jsonArray[i].Success);
                    linuxLabel.push(jsonArray[i].Date);
                    linuxFirstPush = true;
                    
                } else if (i + 3 >= jsonArray.length) {
                    // Once all the points are exhausted add the last point in if it isn't 0
                    // Need to figure out how to do it dynmically too
                    linuxValue.push(jsonArray[i].Success);
                    linuxLabel.push(jsonArray[i].Date);
                } else {
                    // If there is more points than how many days left to plot
                    if (getDaysLeft < plottingPoints) {
                        // plot it normally
                        linuxValue.push(jsonArray[i].Success);
                        linuxLabel.push(jsonArray[i].Date);
                    } else {
                        // implement crazy logic here
                        // what the crazy logic should do is it'll get the average of the dataPointsToPlot
                        // and plot that as the date that's the 1 over the middle date if dataPointsToPlot is even IDEALLY
                        // otherwise plot at exactly the middle date if dataPointsToPlot is odd IDEALLY
                        linuxAverage.push(jsonArray[i].Success);
                        ++linuxPointsToAdd;
                        // once it meets the specific points then it'll add it to the value and label
                        if (linuxPointsToAdd % this.dataPointsToPlot == 0) {
                            var averageValue = avgFunctions.getAveragePercentage(linuxAverage);
                            linuxValue.push(averageValue);
                            linuxLabel.push(jsonArray[i].Date);

                            // clean everything up once it's over
                            // resets the points to 0
                            linuxPointsToAdd = 0;

                            // clean the data conained by popping from the array
                            avgFunctions.cleanAverageData(linuxAverage);

                        } // end if statement
                    } // end else statement
                } // end crazy if statement
            } else {
                // get the starting point of the graph and add it in

                // Need to figure out how to do it dynamically
                if (!macFirstPush) {
                    macValue.push(jsonArray[i].Success);
                    macLabel.push(jsonArray[i].Date);
                    macFirstPush = true;
                } else if (i + 3 >= jsonArray.length) {
                    // Once all the points are exhausted add the last point in if it isn't 0
                    // Need to figure out how to do it dynmically too
                    macValue.push(jsonArray[i].Success);
                    macLabel.push(jsonArray[i].Date);
                } else {
                    // If there is more points than how many days left to plot
                    if (getDaysLeft < plottingPoints) {
                        // plot it normally
                        macValue.push(jsonArray[i].Success);
                        macLabel.push(jsonArray[i].Date);
                    } else {
                        // implement crazy logic here
                        // what the crazy logic should do is it'll get the average of the dataPointsToPlot
                        // and plot that as the date that's the 1 over the middle date if dataPointsToPlot is even IDEALLY
                        // otherwise plot at exactly the middle date if dataPointsToPlot is odd IDEALLY
                        macAverage.push(jsonArray[i].Success);
                        ++macPointsToAdd;
                        // once it meets the specific points then it'll add it to the value and label
                        if (macPointsToAdd % this.dataPointsToPlot == 0) {
                            var averageValue = avgFunctions.getAveragePercentage(macAverage);
                            macValue.push(averageValue);
                            macLabel.push(jsonArray[i].Date);

                            // clean everything up once it's over
                            // resets the points to 0
                            macPointsToAdd = 0;

                            // clean the data conained by popping from the array
                            avgFunctions.cleanAverageData(macAverage);

                        } // end if statement
                    } // end else statement
                } // end crazy if statement
            } // end inner if statement

        } // end for statement

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