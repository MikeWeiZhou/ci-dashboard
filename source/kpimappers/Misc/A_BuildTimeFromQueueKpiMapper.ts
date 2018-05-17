import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")

/**
 * A_BuildTimeFromQueueKpiMapper.
 */
export class A_BuildTimeFromQueueKpiMapper extends KpiMapper
{
    public readonly Title: string = "Build Time From Queue (successful builds)";

    // Moving average of n days
    private _nDaysMovingAverage: number = 30;

    private _target: number = kpigoals.build_time_from_queue.target_minutes;
    private _stretchGoal: number = kpigoals.build_time_from_queue.stretch_minutes;

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
        var minPrevDayData: number = Math.floor(this._nDaysMovingAverage / 2);
        var nPrevDays: number = this._nDaysMovingAverage - 1;
        return [`
            SELECT T1.BUILD_DATE AS 'DATE'
                  ,CASE WHEN COUNT(T2.BUILD_DATE) < ${minPrevDayData}
                        THEN NULL
                        ELSE AVG(T2.AVG_BUILD_TIME)
                        END AS 'AVG_BUILD_TIME'
                  ,T1.CYCLE AS 'CYCLE'
            FROM (
                SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                      ,AVG(MINUTES_TOTAL_QUEUE_AND_BUILD) AS 'AVG_BUILD_TIME'
                      ,CYCLE
                FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
                WHERE BUILD_COMPLETED_DATE BETWEEN
                      DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                  AND IS_SUCCESS = 1
                GROUP BY BUILD_DATE, CYCLE
            ) T1
              LEFT JOIN (
                SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                      ,AVG(MINUTES_TOTAL_QUEUE_AND_BUILD) AS 'AVG_BUILD_TIME'
                      ,CYCLE
                FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
                WHERE BUILD_COMPLETED_DATE BETWEEN
                      DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                  AND IS_SUCCESS = 1
                GROUP BY BUILD_DATE, CYCLE
            ) T2
                ON
                (
                    T2.BUILD_DATE BETWEEN
                    DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
                )
                AND
                (
                    T1.CYCLE = T2.CYCLE
                )
            WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY DATE, CYCLE
            ORDER BY DATE ASC
            ;
        `];
        // return [`
        //     WITH DAILY_AVG_BUILD_TIME AS
        //     (
        //         SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
        //               ,AVG(MINUTES_TOTAL_QUEUE_AND_BUILD) AS 'AVG_BUILD_TIME'
        //               ,CYCLE
        //         FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
        //         WHERE BUILD_COMPLETED_DATE BETWEEN
        //               DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
        //           AND IS_SUCCESS = 1
        //         GROUP BY BUILD_DATE, CYCLE
        //     )
        //     SELECT T1.BUILD_DATE AS 'DATE'
        //           ,CASE WHEN COUNT(T2.BUILD_DATE) < ${minPrevDayData}
        //                 THEN NULL
        //                 ELSE AVG(T2.AVG_BUILD_TIME)
        //                 END AS 'AVG_BUILD_TIME'
        //           ,T1.CYCLE AS 'CYCLE'
        //     FROM DAILY_AVG_BUILD_TIME T1
        //       LEFT JOIN DAILY_AVG_BUILD_TIME T2
        //         ON
        //         (
        //             T2.BUILD_DATE BETWEEN
        //             DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
        //         )
        //         AND
        //         (
        //             T1.CYCLE = T2.CYCLE
        //         )
        //     WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
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
            charts[result.CYCLE].y.push(result.AVG_BUILD_TIME);
        }

        var data: any = [];
        for (let cycle in charts)
        {
            data.push(charts[cycle]);
        }

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
                    fixedrange: true,
                },
                shapes: [
                    // Target Line
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
                    // Stretch Goal Line
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