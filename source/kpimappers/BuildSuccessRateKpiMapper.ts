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
    public readonly Title: string = "Build Success Rate";

    // Minimum number of data points preferred in chart
    private _minNumOfDataPoints: number = 10;

    private readonly _tableName: string = config.db.tablename.qa_builds_and_runs_from_bamboo;
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
        this._minNumOfDataPoints = Math.min(dateRange, this._minNumOfDataPoints);
        this._daysInPeriod = Math.floor(dateRange / this._minNumOfDataPoints);

        return `
            SELECT COUNT(CASE WHEN IS_SUCCESS = 1 THEN IS_SUCCESS END)/COUNT(*) AS SUCCESS_RATE
                  ,FLOOR(DATEDIFF('${to}', BUILD_COMPLETED_DATE) / ${this._daysInPeriod}) AS 'PERIOD'
            FROM ${this._tableName} T
            WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY PERIOD
            ORDER BY PERIOD DESC;
        `;
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
     * Returns a KpiState or null given an array or single JSON object containing required data.
     * @param {Array<any>} jsonArray non-empty JSON array results containing data
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     * @override
     */
    protected mapToKpiStateOrNull(jsonArray: Array<any>): IKpiState|null
    {
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
                    fixedrange: true,
                    range: [dateLowerBound, dateUpperBound]
                },
                yaxis: {
                    tickformat: ',.0%',
                    fixedrange: true,
                    range: [0,1]
                }
            },
            frames: [],
            config: {
                displayModeBar: false
            }
        };
    }
}