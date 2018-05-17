import * as moment from "moment"
import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const kpigoals = require("../../config/kpigoals")
const config = require("../../config/config")

/**
 * BuildSuccessRateSegmentKpiMapper with SimpleMovingAverage.
 * 
 * Days with no data will not be plotted (ignored).
 */
export abstract class BuildSuccessRateSegmentKpiMapper extends KpiMapper
{
    protected abstract splitByColumn: string;
    protected abstract segmentColumn: string;
    protected abstract segmentValue: string;

    // Moving average of n days
    private _nDaysMovingAverage: number = 30;

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
        var minPrevDayData: number = Math.floor(this._nDaysMovingAverage / 2);
        var nPrevDays: number = this._nDaysMovingAverage - 1;
        var segmentQuery: string = (!this.segmentColumn || !this.segmentValue)
            ? ""
            : `AND ${this.segmentColumn} = ${this.segmentValue}`;
        return [
            // Overall
            `
                SELECT T1.BUILD_DATE AS 'DATE'
                    ,AVG(T2.AVG_SUCCESS_RATE) AS 'AVG_SUCCESS_RATE'
                FROM (
                    SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                          ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
                    FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
                    WHERE BUILD_COMPLETED_DATE BETWEEN
                          DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                    GROUP BY BUILD_DATE
                ) T1
                LEFT JOIN (
                    SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                          ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
                    FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
                    WHERE BUILD_COMPLETED_DATE BETWEEN
                          DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
                    GROUP BY BUILD_DATE
                ) T2
                    ON T2.BUILD_DATE BETWEEN
                    DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
                WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
                GROUP BY DATE
                ORDER BY DATE ASC
                ;
            `,
            // Segment split by this.splitByColumn
            `
                SELECT T1.BUILD_DATE AS 'DATE'
                    ,CASE WHEN COUNT(T2.BUILD_DATE) < ${minPrevDayData}
                            THEN NULL
                            ELSE AVG(T2.AVG_SUCCESS_RATE)
                            END AS 'AVG_SUCCESS_RATE'
                    ,T1.${this.splitByColumn} AS '${this.splitByColumn}'
                FROM (
                    SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                        ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
                        ,${this.splitByColumn}
                    FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
                    WHERE (BUILD_COMPLETED_DATE BETWEEN
                        DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
                        ${segmentQuery}
                    GROUP BY BUILD_DATE, ${this.splitByColumn}
                ) T1
                LEFT JOIN (
                    SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
                        ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
                        ,${this.splitByColumn}
                    FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
                    WHERE (BUILD_COMPLETED_DATE BETWEEN
                        DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
                        ${segmentQuery}
                    GROUP BY BUILD_DATE, ${this.splitByColumn}
                ) T2
                ON
                    (
                        T2.BUILD_DATE BETWEEN
                        DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
                    )
                    AND
                    (
                        T2.${this.splitByColumn} = T1.${this.splitByColumn}
                    )
                WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
                GROUP BY DATE, ${this.splitByColumn}
                ORDER BY ${this.splitByColumn} ASC, DATE ASC
                ;
            `
        ];
        // return [
        //     // Overall
        //     `
        //         WITH DAILY_AVG_SUCCESS_RATE AS
        //         (
        //             SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
        //                   ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
        //             FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
        //             WHERE BUILD_COMPLETED_DATE BETWEEN
        //                   DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}'
        //             GROUP BY BUILD_DATE
        //         )
        //         SELECT T1.BUILD_DATE AS 'DATE'
        //             ,AVG(T2.AVG_SUCCESS_RATE) AS 'AVG_SUCCESS_RATE'
        //         FROM DAILY_AVG_SUCCESS_RATE T1
        //         LEFT JOIN DAILY_AVG_SUCCESS_RATE T2
        //           ON T2.BUILD_DATE BETWEEN
        //              DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
        //         WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
        //         GROUP BY DATE
        //         ORDER BY DATE ASC
        //         ;
        //     `,
        //     // Segment split by this.splitByColumn
        //     `
        //         WITH DAILY_AVG_SUCCESS_RATE AS
        //         (
        //             SELECT BUILD_COMPLETED_DATE AS 'BUILD_DATE'
        //                   ,AVG(IS_SUCCESS) AS 'AVG_SUCCESS_RATE'
        //                   ,${this.splitByColumn}
        //             FROM ${config.db.tablename.qa_builds_and_runs_from_bamboo}
        //             WHERE (BUILD_COMPLETED_DATE BETWEEN
        //                   DATE_SUB('${from}', INTERVAL ${nPrevDays} DAY) AND '${to}')
        //                   ${segmentQuery}
        //             GROUP BY BUILD_DATE, ${this.splitByColumn}
        //         )
        //         SELECT T1.BUILD_DATE AS 'DATE'
        //               ,CASE WHEN COUNT(T2.BUILD_DATE) < ${minPrevDayData}
        //                     THEN NULL
        //                     ELSE AVG(T2.AVG_SUCCESS_RATE)
        //                     END AS 'AVG_SUCCESS_RATE'
        //               ,T1.${this.splitByColumn} AS '${this.splitByColumn}'
        //         FROM DAILY_AVG_SUCCESS_RATE T1
        //         LEFT JOIN DAILY_AVG_SUCCESS_RATE T2
        //           ON
        //             (
        //                 T2.BUILD_DATE BETWEEN
        //                 DATE_SUB(T1.BUILD_DATE, INTERVAL ${nPrevDays} DAY) AND T1.BUILD_DATE
        //             )
        //             AND
        //             (
        //                 T2.${this.splitByColumn} = T1.${this.splitByColumn}
        //             )
        //         WHERE T1.BUILD_DATE BETWEEN '${from}' AND '${to}'
        //         GROUP BY DATE, ${this.splitByColumn}
        //         ORDER BY ${this.splitByColumn} ASC, DATE ASC
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
        if (jsonArrays[0].length < 2 || jsonArrays[1].length < 6)
        {
            return null;
        }

        var charts: any = [];
        for (let i in jsonArrays)
        {
            for (let result of jsonArrays[i])
            {
                if (!result[this.splitByColumn])
                {
                    result[this.splitByColumn] = "AllBuilds";
                }
                if (!charts[result[this.splitByColumn]])
                {
                    charts[result[this.splitByColumn]] = {};
                    charts[result[this.splitByColumn]].x = [];
                    charts[result[this.splitByColumn]].y = [];
                    charts[result[this.splitByColumn]].name = result[this.splitByColumn];
                    charts[result[this.splitByColumn]].type = "scatter";
                    charts[result[this.splitByColumn]].mode = "lines";
                    charts[result[this.splitByColumn]].line =
                    {
                        "shape": "spline",
                        "smoothing": 1.3,
                        "width": (result[this.splitByColumn] == "AllBuilds") ? 3 : 1
                    };
                }
                charts[result[this.splitByColumn]].x.push(result.DATE);
                charts[result[this.splitByColumn]].y.push(result.AVG_SUCCESS_RATE);
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
                    title: "Daily success rate",
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