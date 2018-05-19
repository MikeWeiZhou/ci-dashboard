import * as moment from "moment"
import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
import { SimpleMovingAveragePeriod } from "./SimpleMovingAveragePeriod"
const kpi = require("../../config/kpi")
const config = require("../../config/config")

/**
 * BuildTimeFromQueueSegmentKpiMapper with simple moving average.
 * 
 * Days with no data will not be plotted (ignored).
 */
export abstract class BuildTimeFromQueueSegmentKpiMapper extends KpiMapper
{
    // SQL GROUP data by this column
    protected abstract groupByColumn: string;

    // Data is filtered by the column name and value
    // e.g. a table with columns DATE, CYCLE, DESCRIPTION
    //      if filterColumn = CYCLE
    //         filterValue = 'S2018A'
    //      only the S2018A cycle data will be returned
    protected abstract filterColumn: string;
    protected abstract filterValue: string;

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
        var minPrevDayData: number = Math.floor(movingAveragePeriod / 2);
        var nPrevDays: number = movingAveragePeriod - 1;
        var segmentQuery: string = (!this.filterColumn || !this.filterValue)
            ? ""
            : `AND ${this.filterColumn} = ${this.filterValue}`;
        var dailyAvgBuildTimeSubquery: string =
        `(
            SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                  ,AVG(MINUTES_TOTAL_QUEUE_AND_BUILD) AS 'AVG_BUILD_TIME'
            FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
            WHERE (BUILD_COMPLETED_DATE BETWEEN
                  DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
              ${segmentQuery}
            GROUP BY BUILD_DATE
        )`;
        var dailyAvgBuildTimeGroupedSubquery: string =
        `(
            SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                  ,AVG(MINUTES_TOTAL_QUEUE_AND_BUILD) AS 'AVG_BUILD_TIME'
                  ,${this.groupByColumn}
            FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
            WHERE (BUILD_COMPLETED_DATE BETWEEN
                  DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
              ${segmentQuery}
            GROUP BY BUILD_DATE, ${this.groupByColumn}
        )`;
        return [
            // Overall
            `
                SELECT T1.BUILD_DATE AS 'DATE'
                      ,AVG(T2.AVG_BUILD_TIME) AS 'AVG_BUILD_TIME'
                FROM ${dailyAvgBuildTimeSubquery} T1
                LEFT JOIN ${dailyAvgBuildTimeSubquery} T2
                  ON T2.BUILD_DATE BETWEEN
                     DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
                WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
                GROUP BY DATE
                ORDER BY DATE ASC
            `,
            // Segment split by this.groupByColumn
            `
                SELECT T1.BUILD_DATE AS 'DATE'
                      ,CASE WHEN COUNT(T2.BUILD_DATE) < ${minPrevDayData}
                            THEN NULL
                            ELSE AVG(T2.AVG_BUILD_TIME)
                            END AS 'AVG_BUILD_TIME'
                      ,T1.${this.groupByColumn} AS '${this.groupByColumn}'
                FROM ${dailyAvgBuildTimeGroupedSubquery} T1
                LEFT JOIN ${dailyAvgBuildTimeGroupedSubquery} T2
                  ON
                    (
                        T2.BUILD_DATE BETWEEN
                        DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
                    )
                    AND
                    (
                        T2.${this.groupByColumn} = T1.${this.groupByColumn}
                    )
                WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
                GROUP BY DATE, ${this.groupByColumn}
                ORDER BY ${this.groupByColumn} ASC, DATE ASC
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
        if (jsonArrays[0].length < 2 || jsonArrays[1].length < 6)
        {
            return null;
        }

        var charts: any = [];
        for (let i in jsonArrays)
        {
            for (let result of jsonArrays[i])
            {
                if (!result[this.groupByColumn])
                {
                    result[this.groupByColumn] = "Overall";
                }
                if (!charts[result[this.groupByColumn]])
                {
                    charts[result[this.groupByColumn]] = {};
                    charts[result[this.groupByColumn]].x = [];
                    charts[result[this.groupByColumn]].y = [];
                    charts[result[this.groupByColumn]].name = result[this.groupByColumn];
                    charts[result[this.groupByColumn]].type = "scatter";
                    charts[result[this.groupByColumn]].mode = "lines";
                    charts[result[this.groupByColumn]].line =
                    {
                        "shape": "spline",
                        "smoothing": 1.3,
                        "width": (result[this.groupByColumn] == "Overall") ? 3 : 1
                    };
                }
                charts[result[this.groupByColumn]].x.push(result.DATE);
                charts[result[this.groupByColumn]].y.push(result.AVG_BUILD_TIME);
            }
        }

        var data: any = [];
        for (let splitColumn in charts)
        {
            data.push(charts[splitColumn]);
        }

        // Return Plotly.js consumable
        return {
            data: data,
            layout: {
                title: this.Title,
                xaxis: {
                    title: "Date",
                    fixedrange: true,
                    range: [this.chartFromDate, this.chartToDate]
                },
                yaxis: {
                    title: "Build time including queue (in minutes)",
                    fixedrange: true
                },
                shapes: [
                    // Target Line
                    {
                        type: "line",
                        xref: "paper",
                        x0: 0,
                        x1: 1,
                        y0: kpi.goals.build_time_from_queue.target_minutes,
                        y1: kpi.goals.build_time_from_queue.target_minutes,
                        line: {
                            color: "rgb(0, 255, 0)",
                            width: 4,
                            dash:"dot"
                        }
                    },
                    // Stretch Goal Line
                    {
                        type: "line",
                        xref: "paper",
                        x0: 0,
                        x1: 1,
                        y0: kpi.goals.build_time_from_queue.stretch_minutes,
                        y1: kpi.goals.build_time_from_queue.stretch_minutes,
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