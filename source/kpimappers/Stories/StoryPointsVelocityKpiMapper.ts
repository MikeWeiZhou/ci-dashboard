import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")

/**
 * StoryPointsVelocityKpiMapper.
 */
export class StoryPointsVelocityKpiMapper extends KpiMapper
{
    public readonly Title: string = "Story Points Velocity";

    // Minimum number of data points preferred in chart
    // # of data points on actual chart will always be greater than this
    private readonly _preferredMinNumOfDataPoints: number = 15;

    private readonly _tableName: string = config.db.tablename.resolved_story_points;
    private _annualTarget: number = kpigoals.story_points_velocity.target_annual;
    private _annualStretchGoal: number = kpigoals.story_points_velocity.stretch_annual;

    private _minNumOfDataPoints: number;
    private _daysInPeriod: number;
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
        this._minNumOfDataPoints = Math.min(dateRange, this._preferredMinNumOfDataPoints);
        this._daysInPeriod = Math.floor(dateRange / this._minNumOfDataPoints);

        // If date range is not fully divisible by the number of days in a period,
        // more days need to be added to ensure each data point has exactly this._daysInPeriod days.
        // Also, more data data points may be added to ensure the starting date plotted <= from date
        var numDaysInOldestDataPoint = dateRange % this._daysInPeriod;
        var numDaysToAdd = (numDaysInOldestDataPoint == 1)
            ? this._daysInPeriod - numDaysInOldestDataPoint // correct start date, period not full
            : 2 * this._daysInPeriod - numDaysInOldestDataPoint; // wrong start date or period not full
        from = moment(from)
            .subtract(numDaysToAdd, "days")
            .format(config.dateformat.mysql);

        return [`
            SELECT SUM(STORY_POINTS) AS 'POINTS'
                  ,FLOOR(DATEDIFF('${to}', RESOLUTION_DATE) / ${this._daysInPeriod}) AS 'PERIOD'
            FROM ${this._tableName}
            WHERE RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY PERIOD
            ORDER BY PERIOD DESC;
        `];
        /*
        Bigger period values = older
        +--------+--------+
        | POINTS | PERIOD |
        +--------+--------+
        |    43  |      4 |
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
        var jsonArray: Array<any> = jsonArrays[0];

        // Invalid; One data point on a scatter chart shows nothing
        if (jsonArray.length == 1)
        {
            return null;
        }

        var dateLowerBound: string = moment(this._from).format(config.dateformat.charts);
        var dateUpperBound: string = moment(this._to).format(config.dateformat.charts);

        var x: Array<any> = [];
        var y: Array<any> = [];
        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            x.push(moment(this._to)
                .subtract(jsonArray[i].PERIOD * this._daysInPeriod, "days")
                .format(config.dateformat.charts));
            y.push(jsonArray[i].POINTS / this._daysInPeriod);
        }

        return {
            data: [{
                x: x,
                y: y,
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
                    fixedrange: true,
                    range: [dateLowerBound, dateUpperBound]
                },
                yaxis: {
                    title: "Average points / day",
                    fixedrange: true,
                    range: [0, this._annualStretchGoal/365 + 1]
                },
                shapes: [
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