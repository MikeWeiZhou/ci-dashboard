import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
import { SimpleMovingAveragePeriod } from "../SimpleMovingAveragePeriod"
import { GenerateDatesSubquery } from "../GenerateDatesSubquery"
const kpi = require("../../../config/kpi")
const config = require("../../../config/config")

/**
 * B_StoryPointsVsBugsResolvedKpiMapper.
 * 
 * Days with no data will be treated as zero.
 */
export class B_StoryPointsVsBugsResolvedKpiMapper extends KpiMapper
{
    public readonly Title: string = "Story Point Velocity vs Bugs Resolved Velocity";

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
        var generateDatesSubquery: string = GenerateDatesSubquery.GetQuery(from, to);
        var dailyAvgStoryPointsSubquery: string =
        `(
            SELECT RESOLUTION_DATE
                  ,AVG(STORY_POINTS) AS 'AVG_STORY_POINTS'
            FROM ${config.db.tablename.resolved_story_points}
            WHERE RESOLUTION_DATE BETWEEN
                  DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
            GROUP BY RESOLUTION_DATE
        )`;
        var dailyMajorBugsResolvedSubquery: string =
        `(
            SELECT RESOLUTION_DATE
                  ,COUNT(*) AS 'BUGS_RESOLVED'
            FROM ${config.db.tablename.bug_resolution_dates}
            WHERE (RESOLUTION_DATE BETWEEN
                  DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
              AND PRIORITY = 'Major'
            GROUP BY RESOLUTION_DATE
        )`;
        var dailyCriticalBugsResolvedSubquery: string =
        `(
            SELECT RESOLUTION_DATE
                  ,COUNT(*) AS 'BUGS_RESOLVED'
            FROM ${config.db.tablename.bug_resolution_dates}
            WHERE (RESOLUTION_DATE BETWEEN
                  DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
              AND PRIORITY = 'Critical'
            GROUP BY RESOLUTION_DATE
        )`;
        return [
            // Story Points Velocity
            `
                SELECT D1.DATE AS 'DATE'
                      ,IFNULL(SUM(T2.AVG_STORY_POINTS), 0)/${movingAveragePeriod} AS 'AVG_VALUE'
                FROM ${generateDatesSubquery} D1
                  LEFT JOIN ${dailyAvgStoryPointsSubquery} T1
                    ON T1.RESOLUTION_DATE = D1.DATE
                  LEFT JOIN ${dailyAvgStoryPointsSubquery} T2
                    ON T2.RESOLUTION_DATE BETWEEN
                    DATE_SUB(D1.DATE, INTERVAL ${nPrevDays} DAY) AND D1.DATE
                WHERE D1.DATE BETWEEN '${from}' AND '${to}'
                GROUP BY DATE
                ORDER BY DATE ASC
            `,
            // Major Bugs Resolved Velocity
            `
                SELECT D1.DATE AS 'DATE'
                      ,IFNULL(SUM(T2.BUGS_RESOLVED), 0)/${movingAveragePeriod} AS 'AVG_VALUE'
                FROM ${generateDatesSubquery} D1
                  LEFT JOIN ${dailyMajorBugsResolvedSubquery} T1
                    ON T1.RESOLUTION_DATE = D1.DATE
                  LEFT JOIN ${dailyMajorBugsResolvedSubquery} T2
                    ON T2.RESOLUTION_DATE BETWEEN
                       DATE_SUB(D1.DATE, INTERVAL ${nPrevDays} DAY) AND D1.DATE
                WHERE D1.DATE BETWEEN '${from}' AND '${to}'
                GROUP BY DATE
                ORDER BY DATE ASC
            `,
            // Critical Bugs Resolved Velocity
            `
                SELECT D1.DATE AS 'DATE'
                      ,IFNULL(SUM(T2.BUGS_RESOLVED), 0)/${movingAveragePeriod} AS 'AVG_VALUE'
                FROM ${generateDatesSubquery} D1
                  LEFT JOIN ${dailyCriticalBugsResolvedSubquery} T1
                    ON T1.RESOLUTION_DATE = D1.DATE
                  LEFT JOIN ${dailyCriticalBugsResolvedSubquery} T2
                    ON T2.RESOLUTION_DATE BETWEEN
                       DATE_SUB(D1.DATE, INTERVAL ${nPrevDays} DAY) AND D1.DATE
                WHERE D1.DATE BETWEEN '${from}' AND '${to}'
                GROUP BY DATE
                ORDER BY DATE ASC
            `
        ];
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
        if (jsonArrays[0].length < 2 && jsonArrays[1].length < 2 && jsonArrays[3].length < 2)
        {
            return null;
        }

        var chart: any = [];
        this.addDataToChart("Story Points", "y", jsonArrays[0], chart);
        this.addDataToChart("Major Defects", "y", jsonArrays[1], chart);
        this.addDataToChart("Critical Defects", "y", jsonArrays[2], chart);

        // Return Plotly.js consumable
        return {
            data: chart,
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

    private addDataToChart(name: string, yaxis: string, data: Array<any>, chart: Array<any>) : void
    {
        var newChart: any = {};
        newChart.x = [];
        newChart.y = [];
        newChart.yaxis = yaxis;
        newChart.name = name;
        newChart.type = "scatter";
        newChart.mode = "lines";
        newChart.line =
        {
            "shape": "spline",
            "smoothing": 1.3
        };

        for (let record of data)
        {
            newChart.x.push(record.DATE);
            newChart.y.push(record.AVG_VALUE);
        }

        chart.push(newChart);
    }
}