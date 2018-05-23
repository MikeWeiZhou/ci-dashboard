import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
import { SimpleMovingAveragePeriod } from "../SimpleMovingAveragePeriod"
import { GenerateDatesSubquery } from "../GenerateDatesSubquery"
import { Plotly } from "../Plotly"
const config = require("../../../config/config")

/**
 * B_RawBuildTimeKpiMapper.
 * 
 * Days with no data will be treated as zero.
 */
export class B_RawBuildTimeKpiMapper extends KpiMapper
{
    public readonly Title: string = "Build Time From Queue (No Moving Average)";

    private _yAxisTitle: string = "Minutes (lower is better)";

    // Target and stretch goals
    private _targetGoal: number = config.kpi.goals.build_time_from_queue.target_minutes;
    private _stretchGoal: number = config.kpi.goals.build_time_from_queue.stretch_minutes;

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
        var movingAveragePeriod: number = SimpleMovingAveragePeriod.GetPeriod(dateRange);
        var nPrevDays: number = movingAveragePeriod - 1;
        return [`
            SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                ,AVG(MINUTES_TOTAL_QUEUE_AND_BUILD) AS 'AVG_BUILD_TIME'
            FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
            WHERE (BUILD_COMPLETED_DATE BETWEEN
                DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
            GROUP BY BUILD_DATE
            ORDER BY BUILD_DATE ASC
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
        // Invalid; Requires at least 2 data points
        if (jsonArrays[0].length < 2)
        {
            return null;
        }

        // generate trace line
        var traceLine: any = Plotly.GetTraceLineData
        (
            "Overall Build Time", // title
            [],           // empty array
            [],           // empty array
        );

        // add x, y values to trace line
        for (let result of jsonArrays[0])
        {
            traceLine.x.push(result.BUILD_DATE);
            traceLine.y.push(result.AVG_BUILD_TIME);
        }

        // Return Plotly.js consumable
        return {
            data: [traceLine],
            layout: {
                title: this.Title,
                showlegend: true,
                legend: Plotly.GetLegendInfo(),
                xaxis: Plotly.GetDateXAxis(this.chartFromDate, this.chartToDate),
                yaxis: Plotly.GetYAxis(this._yAxisTitle),
                shapes: Plotly.GetShapesFromGoals(this._targetGoal, this._stretchGoal)
            },
            frames: [],
            config: {
                displayModeBar: false
            }
        };
    }
}