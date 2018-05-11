import * as moment from "moment"
import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * BuildSuccessRateKpiMapper.
 */
export class BuildSuccessRateKpiMapper extends KpiMapper
{
    public readonly Category: string = "Product Delivery";
    public readonly Title: string = "Build Success Rate (all branches)";

    // Minimum number of data points preferred in chart
    private readonly _preferredMinNumOfDataPoints: number = 10;

    // Target for build success rate in decimal
    private _target: number = .75;

    // Stretch goal for build success rate in decimal
    private _stretchGoal: number = .90;

    private readonly _tableName: string = config.db.tablename.qa_builds_and_runs_from_bamboo;
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

        return [`
            SELECT COUNT(CASE WHEN IS_SUCCESS = 1 THEN IS_SUCCESS END)/COUNT(*) AS 'SUCCESS_RATE'
                  ,FLOOR(DATEDIFF('${to}', BUILD_COMPLETED_DATE) / ${this._daysInPeriod}) AS 'PERIOD'
            FROM ${this._tableName}
            WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY PERIOD
            ORDER BY PERIOD DESC;
        `];
        /*
        Bigger period values = older
        +--------------+--------+
        | SUCCESS_RATE | PERIOD |
        +--------------+--------+
        |       0.5911 |      2 |
        |       0.4335 |      1 |
        |       0.4492 |      0 |
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
            y.push(jsonArray[i].SUCCESS_RATE);
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
                    title: "Average success rate/day",
                    tickformat: ',.0%',
                    fixedrange: true,
                    range: [0,1]
                },
                shapes: [
                    {
                        type: 'line',
                        xref: 'paper',
                        x0: 0,
                        x1: 1,
                        y0: this._target,
                        y1: this._target,
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
                        y0: this._stretchGoal,
                        y1: this._stretchGoal,
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