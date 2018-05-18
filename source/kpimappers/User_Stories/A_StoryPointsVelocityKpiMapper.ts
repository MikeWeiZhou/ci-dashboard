import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const kpi = require("../../../config/kpi")
const config = require("../../../config/config")

/**
 * A_StoryPointsVelocityKpiMapper.
 * 
 * Days with no data will be treated as zero.
 */
export class A_StoryPointsVelocityKpiMapper extends KpiMapper
{
    public readonly Title: string = "Story Points Velocity";

    // Moving average of n days
    private _nDaysMovingAverage: number = 30;

    private _annualTarget: number = kpi.goals.story_points_velocity.target_annual;
    private _annualStretchGoal: number = kpi.goals.story_points_velocity.stretch_annual;

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
        console.log(`
        SELECT T1.RESOLUTION_DATE AS 'DATE'
            ,SUM(CASE WHEN T2.AVG_STORY_POINTS IS NULL THEN 0 ELSE T2.AVG_STORY_POINTS END)/${this._nDaysMovingAverage} AS 'AVG_STORY_POINTS'
            ,T1.CYCLE AS 'CYCLE'
        FROM (
            SELECT D.DATE AS DATE
            FROM (
                SELECT CAST(DATE_ADD(NOW(), interval -(a.a + (10 * b.a) + (100 * c.a)) day) AS DATE) AS 'DATE'
                FROM
                (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
                CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
                CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
            ) D
            WHERE D.DATE BETWEEN
                DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
        ) D1
        LEFT JOIN (
            SELECT RESOLUTION_DATE
                ,AVG(STORY_POINTS) AS 'AVG_STORY_POINTS'
                ,CYCLE
            FROM ${config.db.tablename.resolved_story_points}
            WHERE RESOLUTION_DATE BETWEEN
                DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
            GROUP BY RESOLUTION_DATE, CYCLE
        ) T1
            ON T1.RESOLUTION_DATE = D1.DATE
        LEFT JOIN (
            SELECT RESOLUTION_DATE
                ,AVG(STORY_POINTS) AS 'AVG_STORY_POINTS'
                ,CYCLE
            FROM ${config.db.tablename.resolved_story_points}
            WHERE RESOLUTION_DATE BETWEEN
                DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
            GROUP BY RESOLUTION_DATE, CYCLE
        ) T2
            ON
            (
                T2.RESOLUTION_DATE BETWEEN
                DATE_SUB(T1.RESOLUTION_DATE, INTERVAL ${nPrevDays} DAY) AND T1.RESOLUTION_DATE
            )
            AND
            (
                T1.CYCLE = T2.CYCLE
            )
        WHERE T1.RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
        GROUP BY DATE, CYCLE
        ORDER BY DATE ASC
        ;
    `);
        return [`
            SELECT D1.DATE AS 'DATE'
                ,SUM(CASE WHEN T2.AVG_STORY_POINTS IS NULL THEN 0 ELSE T2.AVG_STORY_POINTS END)/${this._nDaysMovingAverage} AS 'AVG_STORY_POINTS'
                ,T1.CYCLE AS 'CYCLE'
            FROM (
                SELECT D.DATE AS DATE
                FROM (
                    SELECT CAST(DATE_ADD(NOW(), interval -(a.a + (10 * b.a) + (100 * c.a)) day) AS DATE) AS 'DATE'
                    FROM
                    (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
                    CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
                    CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
                ) D
                WHERE D.DATE BETWEEN
                    DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
            ) D1
            LEFT JOIN (
                SELECT RESOLUTION_DATE
                    ,AVG(STORY_POINTS) AS 'AVG_STORY_POINTS'
                    ,CYCLE
                FROM ${config.db.tablename.resolved_story_points}
                WHERE RESOLUTION_DATE BETWEEN
                    DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                GROUP BY RESOLUTION_DATE, CYCLE
            ) T1
                ON T1.RESOLUTION_DATE = D1.DATE
            LEFT JOIN (
                SELECT RESOLUTION_DATE
                    ,AVG(STORY_POINTS) AS 'AVG_STORY_POINTS'
                    ,CYCLE
                FROM ${config.db.tablename.resolved_story_points}
                WHERE RESOLUTION_DATE BETWEEN
                    DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                GROUP BY RESOLUTION_DATE, CYCLE
            ) T2
                ON
                (
                    T2.RESOLUTION_DATE BETWEEN
                    DATE_SUB(T1.RESOLUTION_DATE, INTERVAL ${nPrevDays} DAY) AND T1.RESOLUTION_DATE
                )
                AND
                (
                    T1.CYCLE = T2.CYCLE
                )
            WHERE T1.RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY DATE, CYCLE
            ORDER BY DATE ASC
            ;
        `];
        // return [`
        //     WITH DAILY_AVG_STORY_POINTS AS
        //     (
        //         SELECT RESOLUTION_DATE
        //               ,AVG(STORY_POINTS) AS 'AVG_STORY_POINTS'
        //               ,CYCLE
        //         FROM ${config.db.tablename.resolved_story_points}
        //         WHERE RESOLUTION_DATE BETWEEN
        //               DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
        //         GROUP BY RESOLUTION_DATE, CYCLE
        //     ),
        //     GENERATED_DATES AS
        //     (
        //         SELECT D.DATE AS DATE
        //         FROM (
        //             SELECT CAST(DATE_ADD(NOW(), interval -(a.a + (10 * b.a) + (100 * c.a)) day) AS DATE) AS 'DATE'
        //             FROM
        //             (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
        //             UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
        //             CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
        //             UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
        //             CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
        //             UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
        //         ) D
        //         WHERE D.DATE BETWEEN
        //               DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
        //     )
        //     SELECT D1.DATE AS 'DATE'
        //           ,SUM(CASE WHEN T2.AVG_STORY_POINTS IS NULL THEN 0 ELSE T2.AVG_STORY_POINTS END)/${this._nDaysMovingAverage} AS 'AVG_STORY_POINTS'
        //           ,T1.CYCLE AS 'CYCLE'
        //     FROM GENERATED_DATES D1
        //       LEFT JOIN DAILY_AVG_STORY_POINTS T1
        //         ON T1.RESOLUTION_DATE = D1.DATE
        //       LEFT JOIN DAILY_AVG_STORY_POINTS T2
        //         ON
        //         (
        //             T2.RESOLUTION_DATE BETWEEN
        //             DATE_SUB(T1.RESOLUTION_DATE, INTERVAL ${nPrevDays} DAY) AND T1.RESOLUTION_DATE
        //         )
        //         AND
        //         (
        //             T1.CYCLE = T2.CYCLE
        //         )
        //     WHERE T1.RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
        //     GROUP BY DATE, CYCLE
        //     ORDER BY DATE ASC
        //     ;
        // `];
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

        var charts: any = [];
        for (let result of jsonArrays[0])
        {
            if (!charts[result.CYCLE])
            {
                charts[result.CYCLE] = {};
                charts[result.CYCLE].x = [];
                charts[result.CYCLE].y = [];
                charts[result.CYCLE].name = result.CYCLE;
                charts[result.CYCLE].type = "scatter";
                charts[result.CYCLE].mode = "lines";
                charts[result.CYCLE].line =
                {
                    "shape": "spline",
                    "smoothing": 1.3
                };
            }
            charts[result.CYCLE].x.push(result.DATE);
            charts[result.CYCLE].y.push(result.AVG_STORY_POINTS);
        }

        var data: any = [];
        for (let cycle in charts)
        {
            data.push(charts[cycle]);
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
                    title: "Average story points / day",
                    fixedrange: true,
                    rangemode: "nonnegative"
                },
                shapes: [
                    // Annual Target Line
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
                    // Annual Stretch Goal Line
                    {
                        type: 'line',
                        xref: 'paper',
                        x0: 0,
                        x1: 1,
                        y0: this._annualStretchGoal/365,
                        y1: this._annualStretchGoal/365,
                        line: {
                            color: 'gold',
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