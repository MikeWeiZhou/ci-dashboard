import * as moment from "moment"
import { AvgPointsFunctions } from "./Functions/AvgPointsFunctions"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const config = require("../../../config/config")

/**
 * QaOverallBuildSuccessKpiMapper.
 * 
 * QA Overall Build Success.
 */
export class QaOverallBuildSuccessKpiMapper extends KpiMapper
{
    public readonly Title: string = "QA Overall Build Success";

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
        SELECT DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d") AS Date, 
        AVG(CASE WHEN  BUILD_STATE = "Successful" THEN 1 ELSE 0 END) as Success
        FROM ${this._tablename} Where BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
        GROUP BY DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d") 
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

        var overallPointsToAdd = 0;

        var successValue: Array<any> = [];
        var overallLabel: Array<any> = [];
        var overallAverage: Array<any> = [];

         // 30 day difference example
         var getDaysLeft = avgFunctions.getHowManyDaysLeft(this._from, this._to);

         // Find out how many data points to split across using Math.Floor
        this.dataPointsToPlot = Math.floor((getDaysLeft/plottingPoints));

        var overallFirstPush = false;

        for (let i: number = 0; i < jsonArray.length; ++i) {
            // get the starting point of the graph and add it in

            if (!overallFirstPush) {
                successValue.push(jsonArray[i].Success);
                overallLabel.push(jsonArray[i].Date);
                overallFirstPush = true;
            } else {
                // If there is more points than how many days left to plot
                if (getDaysLeft < plottingPoints) {
                    // plot it normally
                    successValue.push(jsonArray[i].Success);
                    overallLabel.push(jsonArray[i].Date);
                } else {
                    // Implement crazy logic here
                    overallAverage.push(jsonArray[i].Success);
                    ++overallPointsToAdd;
                    // Once it meets the specific points then it'll add to the value and label
                    // or if it is the final point
                    if ((overallPointsToAdd % this.dataPointsToPlot == 0) || (moment(this._to).diff(jsonArray[i].Date,'days') == 0)) {
                        var averageValue = avgFunctions.getAveragePercentage(overallAverage);
                        successValue.push(averageValue);
                        overallLabel.push(jsonArray[i].Date);

                        // clean everything up once it's over
                        // resets the points to 0
                        overallPointsToAdd = 0;

                        // clean data conained by popping from the array
                        avgFunctions.cleanAverageData(overallAverage); 
                    } // end if statement
                } // end else statement
            } // end crazy if statement
            
        }

        return {
            data: [{
                x: overallLabel,
                y: successValue,
                name: "Overall Build Success",
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