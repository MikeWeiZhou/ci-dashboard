import * as moment from "moment"
import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * StoryPointsVelocityKpiMapper.
 */
export class StoryPointsVelocityKpiMapper extends KpiMapper
{
    public readonly Category: string = "Development";
    public readonly Title: string = "Story Points Velocity";

    // Minimum number of data points preferred in chart
    private readonly _preferredMinNumOfDataPoints: number = 10;

    // Target for number of story points to be completed annually
    private _annualTarget: number = 1088;

    // Stretch goal for number of story points to be completed annually
    private _annualStretchGoal: number = 1137;

    private readonly _tableName: string = config.db.tablename.resolved_story_points;
    private _minNumOfDataPoints: number;
    private _daysInPeriod: number;
    private _from: string;
    private _to: string;

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
        this._from = from;
        this._to = to;
        this._minNumOfDataPoints = Math.min(dateRange, this._preferredMinNumOfDataPoints);
        this._daysInPeriod = Math.floor(dateRange / this._minNumOfDataPoints);

        return `
            SELECT COUNT(*) AS 'COUNT'
                  ,FLOOR(DATEDIFF('${to}', RESOLUTION_DATE) / ${this._daysInPeriod}) AS 'PERIOD'
            FROM ${this._tableName}
            WHERE RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY PERIOD
            ORDER BY PERIOD DESC;
        `;
        /*
        Bigger period values = older
        +-------+--------+
        | COUNT | PERIOD |
        +-------+--------+
        |    43 |      4 |
        |     7 |      3 |
        |     4 |      2 |
        |     9 |      1 |
        +-------+--------+*/
    }

    /**
     * Returns a KpiState or null given an array or single JSON object containing required data.
     * @param {Array<any>} jsonArray non-empty JSON array results containing data
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     * @override
     */
    protected mapToKpiStateOrNull(jsonArray: Array<any>): IKpiState|null
    {
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
            y.push(jsonArray[i].COUNT / this._daysInPeriod);
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
                    title: "Average points/day",
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
                            color: 'rgb(255, 0, 0)',
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