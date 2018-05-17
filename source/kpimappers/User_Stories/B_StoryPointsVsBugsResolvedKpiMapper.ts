import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")

/**
 * B_StoryPointsVsBugsResolvedKpiMapper.
 * 
 * Days with no data will be treated as zero.
 */
export class B_StoryPointsVsBugsResolvedKpiMapper extends KpiMapper
{
    public readonly Title: string = "Story Points vs Bugs Resolved";

    // Moving average of n days
    private _nDaysMovingAverage: number = 30;

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
        var nPrevDays: number = this._nDaysMovingAverage - 1;
        return [
            // Story Points Velocity
            `
                SELECT T1.RESOLUTION_DATE AS 'DATE'
                    ,SUM(T2.AVG_STORY_POINTS)/${this._nDaysMovingAverage} AS 'AVG_VALUE'
                FROM (
                    SELECT RESOLUTION_DATE
                        ,AVG(STORY_POINTS) AS 'AVG_STORY_POINTS'
                    FROM ${config.db.tablename.resolved_story_points}
                    WHERE RESOLUTION_DATE BETWEEN
                        DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                    GROUP BY RESOLUTION_DATE
                ) T1
                LEFT JOIN (
                    SELECT RESOLUTION_DATE
                        ,AVG(STORY_POINTS) AS 'AVG_STORY_POINTS'
                    FROM ${config.db.tablename.resolved_story_points}
                    WHERE RESOLUTION_DATE BETWEEN
                        DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                    GROUP BY RESOLUTION_DATE
                ) T2
                    ON
                    (
                        T2.RESOLUTION_DATE BETWEEN
                        DATE_SUB(T1.RESOLUTION_DATE, INTERVAL ${nPrevDays} DAY) AND T1.RESOLUTION_DATE
                    )
                WHERE T1.RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
                GROUP BY DATE
                ORDER BY DATE ASC
                ;
            `,
            // Bugs Resolved Rate
            `
                SELECT T1.RESOLUTION_DATE AS 'DATE'
                    ,SUM(T2.BUGS_RESOLVED)/${this._nDaysMovingAverage} AS 'AVG_VALUE'
                    ,T1.PRIORITY AS 'PRIORITY'
                FROM (
                    SELECT RESOLUTION_DATE
                        ,COUNT(*) AS 'BUGS_RESOLVED'
                        ,PRIORITY
                    FROM ${config.db.tablename.bug_resolution_dates}
                    WHERE RESOLUTION_DATE BETWEEN
                        DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                    GROUP BY RESOLUTION_DATE, PRIORITY
                ) T1
                LEFT JOIN (
                    SELECT RESOLUTION_DATE
                        ,COUNT(*) AS 'BUGS_RESOLVED'
                        ,PRIORITY
                    FROM ${config.db.tablename.bug_resolution_dates}
                    WHERE RESOLUTION_DATE BETWEEN
                        DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                    GROUP BY RESOLUTION_DATE, PRIORITY
                ) T2
                    ON
                    (
                        T2.RESOLUTION_DATE BETWEEN
                        DATE_SUB(T1.RESOLUTION_DATE, INTERVAL ${nPrevDays} DAY) AND T1.RESOLUTION_DATE
                    )
                    AND
                    (
                        T1.PRIORITY = T2.PRIORITY
                    )
                WHERE T1.RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
                GROUP BY DATE, PRIORITY
                ORDER BY DATE ASC
                ;
            `
        ];
        // return [
        //     // Story Points Velocity
        //     `
        //         WITH DAILY_AVG_STORY_POINTS AS
        //         (
        //             SELECT RESOLUTION_DATE
        //                 ,AVG(STORY_POINTS) AS 'AVG_STORY_POINTS'
        //             FROM ${config.db.tablename.resolved_story_points}
        //             WHERE RESOLUTION_DATE BETWEEN
        //                 DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
        //             GROUP BY RESOLUTION_DATE
        //         )
        //         SELECT T1.RESOLUTION_DATE AS 'DATE'
        //             ,SUM(T2.AVG_STORY_POINTS)/${this._nDaysMovingAverage} AS 'AVG_VALUE'
        //         FROM DAILY_AVG_STORY_POINTS T1
        //         LEFT JOIN DAILY_AVG_STORY_POINTS T2
        //             ON
        //             (
        //                 T2.RESOLUTION_DATE BETWEEN
        //                 DATE_SUB(T1.RESOLUTION_DATE, INTERVAL ${nPrevDays} DAY) AND T1.RESOLUTION_DATE
        //             )
        //         WHERE T1.RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
        //         GROUP BY DATE
        //         ORDER BY DATE ASC
        //         ;
        //     `,
        //     // Bugs Resolved Rate
        //     `
        //         WITH DAILY_BUGS_RESOLVED AS
        //         (
        //             SELECT RESOLUTION_DATE
        //                 ,COUNT(*) AS 'BUGS_RESOLVED'
        //                 ,PRIORITY
        //             FROM ${config.db.tablename.bug_resolution_dates}
        //             WHERE RESOLUTION_DATE BETWEEN
        //                 DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
        //             GROUP BY RESOLUTION_DATE, PRIORITY
        //         )
        //         SELECT T1.RESOLUTION_DATE AS 'DATE'
        //             ,SUM(T2.BUGS_RESOLVED)/${this._nDaysMovingAverage} AS 'AVG_VALUE'
        //             ,T1.PRIORITY AS 'PRIORITY'
        //         FROM DAILY_BUGS_RESOLVED T1
        //         LEFT JOIN DAILY_BUGS_RESOLVED T2
        //             ON
        //             (
        //                 T2.RESOLUTION_DATE BETWEEN
        //                 DATE_SUB(T1.RESOLUTION_DATE, INTERVAL ${nPrevDays} DAY) AND T1.RESOLUTION_DATE
        //             )
        //             AND
        //             (
        //                 T1.PRIORITY = T2.PRIORITY
        //             )
        //         WHERE T1.RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
        //         GROUP BY DATE, PRIORITY
        //         ORDER BY DATE ASC
        //         ;
        //     `
        // ];
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
        if (jsonArrays[0].length < 2 && jsonArrays[1].length < 2)
        {
            return null;
        }

        var charts: any = [];
        for (let i in jsonArrays)
        {
            for (let result of jsonArrays[i])
            {
                if (!result.PRIORITY)
                {
                    result.PRIORITY = "StoryPoints";
                }
                if (!charts[result.PRIORITY])
                {
                    charts[result.PRIORITY] = {};
                    charts[result.PRIORITY].x = [];
                    charts[result.PRIORITY].y = [];
                    charts[result.PRIORITY].yaxis = (result.PRIORITY == "StoryPoints")
                        ? "y"
                        : "y2";
                    charts[result.PRIORITY].name = `${result.PRIORITY}`;
                    charts[result.PRIORITY].type = "scatter";
                    charts[result.PRIORITY].mode = "lines";
                    charts[result.PRIORITY].line =
                    {
                        "shape": "spline",
                        "smoothing": 1.3
                    };
                }
                charts[result.PRIORITY].x.push(result.DATE);
                charts[result.PRIORITY].y.push(result.AVG_VALUE);
            }
        }

        var data: any = [];
        for (let priority in charts)
        {
            data.push(charts[priority]);
        }

        // Return Plotly.js consumable
        return {
            data: data,
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