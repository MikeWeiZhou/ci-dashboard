import * as moment from "moment"
import { AverageLineKpiMapper } from "../AverageLineKpiMapper"
import { IKpiState } from "../IKpiState"
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")

/**
 * StoryPointsOnBugsResolutionKpiMapper.
 * 
 * Days with no data will be treated as zero.
 */
export class StoryPointsOnBugsResolutionKpiMapper extends AverageLineKpiMapper
{
    public readonly Title: string = "Story Points on Bugs Resolution";

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
            `,
            `
                SELECT COUNT(*) AS 'VALUE'
                      ,FLOOR(DATEDIFF('${this.dataToDate}', RESOLUTION_DATE) / ${this.daysInOneDataPoint}) AS 'PERIOD'
                FROM ${config.db.tablename.bug_resolution_dates}
                WHERE RESOLUTION_DATE BETWEEN '${this.dataFromDate}' AND '${this.dataToDate}'
                GROUP BY PERIOD
                ORDER BY PERIOD DESC;
            `,
            `
                SELECT COUNT(*) AS 'VALUE'
                      ,FLOOR(DATEDIFF('${this.dataToDate}', RESOLUTION_DATE) / ${this.daysInOneDataPoint}) AS 'PERIOD'
                FROM ${config.db.tablename.bug_resolution_dates}
                WHERE RESOLUTION_DATE BETWEEN '${this.dataFromDate}' AND '${this.dataToDate}'
                  AND PRIORITY = 'Major'
                GROUP BY PERIOD
                ORDER BY PERIOD DESC;
            `,
            `
                SELECT COUNT(*) AS 'VALUE'
                      ,FLOOR(DATEDIFF('${this.dataToDate}', RESOLUTION_DATE) / ${this.daysInOneDataPoint}) AS 'PERIOD'
                FROM ${config.db.tablename.bug_resolution_dates}
                WHERE RESOLUTION_DATE BETWEEN '${this.dataFromDate}' AND '${this.dataToDate}'
                  AND PRIORITY = 'Critical'
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
        +--------+--------+
        +---------------+--------+
        | BUGS_RESOLVED | PERIOD |
        +---------------+--------+
        |             4 |      3 |
        |             9 |      2 |
        |             7 |      1 |
        |             6 |      0 |
        +---------------+--------+*/
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
        if
        (
            jsonArrays[0].length < 2 &&
            jsonArrays[1].length < 2 &&
            jsonArrays[2].length < 2 &&
            jsonArrays[3].length < 2
        )
        {
            return null;
        }

        var storyPointsChart: any = this.getChartZeroMissingData(jsonArrays[0]);
        var bugsResolvedOverallChart: any = this.getChartZeroMissingData(jsonArrays[1]);
        var bugsResolvedMajorChart: any = this.getChartZeroMissingData(jsonArrays[2]);
        var bugsResolvedCriticalChart: any = this.getChartZeroMissingData(jsonArrays[3]);

        // Return Plotly.js consumable
        return {
            data: [
                // Story Points Data Set
                {
                    x: storyPointsChart.dates,
                    y: storyPointsChart.values,
                    name: "Story Points Velocity",
                    type: "scatter",
                    mode: "lines+markers",
                    line: {
                        "shape": "spline",
                        "smoothing": 1.3
                    }
                },
                // Bugs Resolved Overall Data Set
                {
                    x: bugsResolvedOverallChart.dates,
                    y: bugsResolvedOverallChart.values,
                    yaxis: "y2",
                    name: "Bugs Resolved (overall)",
                    type: "scatter",
                    mode: "lines+markers",
                    line: {
                        "shape": "spline",
                        "smoothing": 1.3
                    }
                },
                // Bugs Resolved Major Data Set
                {
                    x: bugsResolvedMajorChart.dates,
                    y: bugsResolvedMajorChart.values,
                    yaxis: "y2",
                    name: "Bugs Resolved (Major)",
                    type: "scatter",
                    mode: "lines+markers",
                    line: {
                        "shape": "spline",
                        "smoothing": 1.3
                    }
                },
                // Bugs Resolved Critical Data Set
                {
                    x: bugsResolvedCriticalChart.dates,
                    y: bugsResolvedCriticalChart.values,
                    yaxis: "y2",
                    name: "Bugs Resolved (Critical)",
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
                legend: {
                    xanchor: "center",
                    yanchor: "bottom"
                },
                xaxis: {
                    title: "Date",
                    fixedrange: true,
                    range: [this.chartFromDate, this.chartToDate]
                },
                yaxis: {
                    title: "Average story points / day",
                    fixedrange: true,
                    rangemode: "nonnegative",
                },
                yaxis2: {
                    title: "Average bugs resolved / day",
                    fixedrange: true,
                    overlaying: "y",
                    rangemode: "nonnegative",
                    side: "right"
                },
            },
            frames: [],
            config: {
                displayModeBar: false
            }
        };
    }
}