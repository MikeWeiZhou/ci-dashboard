import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * QaOverallBuildSuccessKpiMapper.
 * 
 * QA Overall Build Success vs Fail.
 */
export class QaOverallBuildSuccessKpiMapper extends KpiMapper
{
    public readonly Category: string = "Quality Assurance";
    public readonly Title: string = "QA Overall Build Success";

    private _tablename: string = config.db.tablename.qa_builds_and_runs_from_bamboo;

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
        return [`
        SELECT DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d") AS Date, 
        AVG(CASE WHEN  BUILD_STATE = "Successful" THEN 1 ELSE 0 END) as Success
        FROM ${this._tablename} Where BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
        GROUP BY DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d") 
        ORDER BY DATE_FORMAT(BUILD_COMPLETED_DATE, "%Y-%m-%d");
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
        var jsonArray: Array<any> = jsonArrays[0];
        var successValue: Array<any> = [];
        var overallLabel: Array<any> = [];

        // Edit the stretch goal here
        const stretchGoal = 0.75;

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            successValue.push(jsonArray[i].Success);
            overallLabel.push(jsonArray[i].Date);
        }

        return {
            data: [{
                x: overallLabel,
                y: successValue,
                name: "Overall Build Success",
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
                    title: "Date",
                    fixedrange: true
                },
                yaxis: {
                    title: 'Build Percentage',
                    tickformat: ',.0%',
                    fixedrange: true,
                    range: [0,1]
                },
                shapes: [{
                    type: 'line',
                    xref: 'paper',
                    x0: 0,
                    y0: stretchGoal,
                    x1: 1,
                    y1: stretchGoal,
                    line: {
                        color: 'rgb(255, 0, 0)',
                        width: 4,
                        dash:'dot'
                    }
                }]
            },
            frames: [],
            config: {displayModeBar: false}
        };
    }
}