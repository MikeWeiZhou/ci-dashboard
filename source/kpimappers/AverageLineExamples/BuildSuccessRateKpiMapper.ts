import * as moment from "moment"
import { AverageLineKpiMapper } from "../AverageLineKpiMapper"
import { IKpiState } from "../IKpiState"
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")

/**
 * BuildSuccessRateKpiMapper.
 * 
 * Days with no data will not be plotted (ignored).
 */
export class BuildSuccessRateKpiMapper extends AverageLineKpiMapper
{
    public readonly Title: string = "Build Success Rate (all branches)";

    private _target: number = kpigoals.build_success_rate.target_rate;
    private _stretchGoal: number = kpigoals.build_success_rate.stretch_rate;

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
        return [`
            SELECT AVG(IS_SUCCESS) AS 'VALUE'
                  ,FLOOR(DATEDIFF('${this.dataToDate}', BUILD_COMPLETED_DATE) / ${this.daysInOneDataPoint}) AS 'PERIOD'
            FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
            WHERE BUILD_COMPLETED_DATE BETWEEN '${this.dataFromDate}' AND '${this.dataToDate}'
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
        // Invalid; Requires at least 2 data points
        if (jsonArrays[0].length < 2)
        {
            return null;
        }

        var chart: any = this.getChartIgnoreMissingData(jsonArrays[0]);

        // Return Plotly.js consumable
        return {
            data: [
                // Build Success Rate Data Set
                {
                    x: chart.dates,
                    y: chart.values,
                    name: "Build Success Rate (all branches)",
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
}