import * as moment from "moment"
import { AverageLineKpiMapper } from "../AverageLineKpiMapper"
import { IKpiState } from "../IKpiState"
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")

/**
 * StoryPointsVelocityKpiMapper.
 * 
 * Days with no data will be treated as zero.
 */
export class StoryPointsVelocityKpiMapper extends AverageLineKpiMapper
{
    public readonly Title: string = "Story Points Velocity";

    private _annualTarget: number = kpigoals.story_points_velocity.target_annual;
    private _annualStretchGoal: number = kpigoals.story_points_velocity.stretch_annual;

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
        super.getQueryStrings(from, to, dateRange);
        return [
            `
                SELECT SUM(STORY_POINTS) AS 'VALUE'
                      ,FLOOR(DATEDIFF('${this.dataToDate}', RESOLUTION_DATE) / ${this.daysInOneDataPoint}) AS 'PERIOD'
                FROM ${config.db.tablename.resolved_story_points}
                WHERE RESOLUTION_DATE BETWEEN '${this.dataFromDate}' AND '${this.dataToDate}'
                GROUP BY PERIOD
                ORDER BY PERIOD DESC;
            `
        ];
        /*
        Bigger period values = older
        +--------+--------+
        | POINTS | PERIOD |
        +--------+--------+
        |     7  |      3 |
        |     4  |      2 |
        |     9  |      1 |
        +--------+--------+*/
    }

    /**
     * Returns a KpiState given multiple JSON arrays containing queried data.
     * @param {Array<any>[]} jsonArrays One or more JSON array results (potentially empty arrays)
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     * @override
     */
    protected mapToKpiStateOrNull(jsonArrays: Array<any>[]): IKpiState|null
    {
        // Invalid; Requires at least 2 data points
        if (jsonArrays[0].length < 2)
        {
            return null;
        }

        var chart: any = this.getChartZeroMissingData(jsonArrays[0]);

        // Return Plotly.js consumable
        return {
            data: [
                // Story Points Data Set
                {
                    x: chart.dates,
                    y: chart.values,
                    name: "Story Points Velocity",
                    type: "scatter",
                    mode: "lines+markers",
                    line: {
                        "shape": "spline",
                        "smoothing": 1.3
                    }
                }
            ],
            layout: {
                title: this.Title,
                xaxis: {
                    title: "Date",
                    fixedrange: true,
                    range: [this.chartFromDate, this.chartToDate]
                },
                yaxis: {
                    title: "Average story points / day",
                    fixedrange: true,
                    rangemode: "nonnegative"
                },
                shapes: [
                    // Annual Target Line
                    {
                        type: 'line',
                        xref: 'paper',
                        x0: 0,
                        x1: 1,
                        y0: this._annualTarget/365,
                        y1: this._annualTarget/365,
                        line: {
                            color: 'rgb(0, 255, 0)',
                            width: 4,
                            dash:'dot'
                        }
                    },
                    // Annual Stretch Goal Line
                    {
                        type: 'line',
                        xref: 'paper',
                        x0: 0,
                        x1: 1,
                        y0: this._annualStretchGoal/365,
                        y1: this._annualStretchGoal/365,
                        line: {
                            color: 'gold',
                            width: 4,
                            dash:'dot'
                        }
                    }
                ]
            },
            frames: [],
            config: {
                displayModeBar: false
            }
        };
    }
}