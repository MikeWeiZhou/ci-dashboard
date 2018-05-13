import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")

/**
 * BuildSuccessRateKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class BuildSuccessRateKpiMapper extends KpiMapper
{
    public readonly Title: string = "Build Success Rate (all branches)";

    // Minimum number of data points preferred in chart
    // # of data points on actual chart will always be between date range and 2x+1
    private readonly _preferredMinNumOfDataPoints: number = 15;

    private readonly _tableName: string = config.db.tablename.qa_builds_and_runs_from_bamboo;
    private _target: number = kpigoals.build_success_rate.target_rate;
    private _stretchGoal: number = kpigoals.build_success_rate.stretch_rate;

    private _minNumOfDataPoints: number;
    private _daysInOneDataPoint: number;
    private _expectedNumDataPoints: number;
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

        // Calculate number of days per data point
        this._minNumOfDataPoints = Math.min(dateRange, this._preferredMinNumOfDataPoints);
        this._daysInOneDataPoint = Math.ceil(dateRange / this._minNumOfDataPoints);

        // If date range is not fully divisible by the number of days in one data point,
        // more days need to be added to ensure each data point has exactly this._daysInOneDataPoint days.
        // Also, 1 - 2 data points are added to ensure the starting date plotted <= from date
        var numDaysToAdd = 2 * this._daysInOneDataPoint - (dateRange % this._daysInOneDataPoint);
        var dataFrom = moment(from).subtract(numDaysToAdd, "days").format(config.dateformat.mysql);

        // Calculate number of expected data points assumming no missing/empty data in between from-to date
        this._expectedNumDataPoints = (moment(this._to).diff(dataFrom, "days") + 1) / this._daysInOneDataPoint;

        return [`
            SELECT AVG(IS_SUCCESS) AS 'SUCCESS_RATE'
                  ,FLOOR(DATEDIFF('${to}', BUILD_COMPLETED_DATE) / ${this._daysInOneDataPoint}) AS 'PERIOD'
            FROM ${this._tableName}
            WHERE BUILD_COMPLETED_DATE BETWEEN '${dataFrom}' AND '${to}'
            GROUP BY PERIOD
            ORDER BY PERIOD DESC;
        `];
        /*
        Bigger period values = older
        +--------------+--------+
        | SUCCESS_RATE | PERIOD |
        +--------------+--------+
        |       0.5256 |      2 |
        |       0.4444 |      1 |
        |       0.5085 |      0 |
        +--------------+--------+*/
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

        // Invalid; Requires at least 2 data points
        if (jsonArray.length < 2)
        {
            return null;
        }

        var successRateXY: any = this.getSuccessRateXY(jsonArrays[0], this._expectedNumDataPoints);
        var dateLowerBound: string = moment(this._from).format(config.dateformat.charts);
        var dateUpperBound: string = moment(this._to).format(config.dateformat.charts);

        // Return Plotly.js consumable
        return {
            data: [
                // Build Success Rate Data Set
                {
                    x: successRateXY.x,
                    y: successRateXY.y,
                    name: "Build Success Rate (all branches)",
                    type: "scatter",
                    mode: "lines",
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
                    range: [dateLowerBound, dateUpperBound]
                },
                yaxis: {
                    title: "Average success rate / day",
                    tickformat: ",.0%",
                    fixedrange: true,
                    range: [0,1]
                },
                shapes: [
                    // Daily Target Line
                    {
                        type: "line",
                        xref: "paper",
                        x0: 0,
                        x1: 1,
                        y0: this._target,
                        y1: this._target,
                        line: {
                            color: "rgb(0, 255, 0)",
                            width: 4,
                            dash:"dot"
                        }
                    },
                    // Daily Stretch Goal Line
                    {
                        type: "line",
                        xref: "paper",
                        x0: 0,
                        x1: 1,
                        y0: this._stretchGoal,
                        y1: this._stretchGoal,
                        line: {
                            color: "gold",
                            width: 4,
                            dash:"dot"
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

    /**
     * Returns Success Rate XY values.
     * Missing data points: ignored.
     * @param {Array<any>} data
     * @param {number} expectedDataPoints
     * @returns {object} XY values
     */
    private getSuccessRateXY(data: Array<any>, expectedDataPoints: number) : object
    {
        var x: Array<any> = [];
        var y: Array<any> = [];
        for (let i: number = 0; i < data.length; ++i)
        {
            x.push(moment(this._to)
                .subtract(data[i].PERIOD * this._daysInOneDataPoint, "days")
                .format(config.dateformat.charts));
            y.push(data[i].SUCCESS_RATE);
        }

        return {
            x: x,
            y: y
        };
    }
}