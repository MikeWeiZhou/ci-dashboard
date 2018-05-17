import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
import * as moment from "moment"
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")

/**
 * DefectsTotalNumberOfBugs.
 * 
 * Defects - Total Number of Bugs
 */
export class DefectsTotalNumberOfBugsKpiMapper extends KpiMapper
{
    private _from: string;
    private _to: string;

    public readonly Title: string = "Total Defects - Bugs Created/Day";

    private _tablename: string = config.db.tablename.bug_resolution_dates;
    private _annualTarget: number = kpigoals.bugs_per_day.target;
    private _annualStretchGoal: number = kpigoals.bugs_per_day.stretch;

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
        this._from = from;
        this._to = to;

        return [
            `          
            SELECT T1.Date AS Date
                  ,AVG(T2.Value) AS Average
            FROM 
            (
                SELECT
                CAST(CREATION_DATE AS DATE) AS Date,
                COUNT(CREATION_DATE) AS Value,
                PRIORITY
                FROM ${this._tablename}
                WHERE CREATION_DATE BETWEEN '${from}' AND '${to}'
                AND PRIORITY = 'Critical'
                GROUP BY 1
            ) as T1
            LEFT JOIN 
            (
                SELECT
                CAST(CREATION_DATE AS DATE) AS Date,
                COUNT(CREATION_DATE) AS Value,
                PRIORITY
                FROM ${this._tablename}
                WHERE CREATION_DATE BETWEEN '${from}' AND '${to}'
                AND PRIORITY = 'Critical'
                GROUP BY 1
            ) as T2
              ON T2.Date BETWEEN
                 DATE_ADD(T1.Date, INTERVAL -6 DAY) AND T1.Date
            WHERE T1.Date BETWEEN '${from}' AND '${to}'
            GROUP BY Date
			ORDER BY CAST(T1.Date AS DATE) ASC
            `,
            `SELECT T1.Date AS Date
            ,AVG(T2.Value) AS Average
            FROM 
            (
                SELECT
                CAST(CREATION_DATE AS DATE) AS Date,
                COUNT(CREATION_DATE) AS Value,
                PRIORITY
                FROM ${this._tablename}
                WHERE CREATION_DATE BETWEEN '${from}' AND '${to}'
                AND PRIORITY = 'Major'
                GROUP BY 1
            ) as T1
            LEFT JOIN 
            (
                SELECT
                CAST(CREATION_DATE AS DATE) AS Date,
                COUNT(CREATION_DATE) AS Value,
                PRIORITY
                FROM ${this._tablename}
                WHERE CREATION_DATE BETWEEN '${from}' AND '${to}'
                AND PRIORITY = 'Major'
                GROUP BY 1
            ) as T2
                ON T2.Date BETWEEN
                DATE_ADD(T1.Date, INTERVAL -6 DAY) AND T1.Date
            WHERE T1.Date BETWEEN '${from}' AND '${to}'
            GROUP BY Date
            ORDER BY CAST(T1.Date AS DATE) ASC
            `
        ];

        //The query creates a temporary table (tbl) that stores the bug count, if available, for each 
        //day in the date range. Self joining each date with dates in the 
        //range of the past # of days produces the 
        //available number of days that exist specifically for that date's sub-range (ie: period).
        //The average is computed as (bug count on date/# of days in the period).

    }

    /**
     * Returns a KpiState given multiple JSON arrays containing queried data.
     * @param {Array<any>[]} jsonArrays One or more JSON array results (potentially empty arrays)
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     * @override
     */
    protected mapToKpiStateOrNull(jsonArrays: Array<any>[]): IKpiState|null
    {
        var dateLowerBound: string = moment(this._from).format(config.dateformat.charts);
        var dateUpperBound: string = moment(this._to).format(config.dateformat.charts);

        var maxYVal:number = jsonArrays[0][0].Average;
        var minYVal:number = 0;

        var values: Array<any>[] =[];
        var labels: Array<any>[]= [];
        var values2: Array<any>[] =[];
        var labels2: Array<any>[]= [];

        jsonArrays[0].forEach(function(a){
            values.push(a.Average);
            labels.push(a.Date);
            if(maxYVal < a.Average) {
                maxYVal = a.Average
            }
            if(minYVal < a.Average) {
                minYVal = a.Average
            }
        });
        jsonArrays[1].forEach(function(a){
            values2.push(a.Average);
            labels2.push(a.Date);
            if(maxYVal < a.Average) {
                maxYVal = a.Average
            }
            if(minYVal < a.Average) {
                minYVal = a.Average
            }
        });

        return {
            data: [{
                x: labels,
                y: values,
                name: "Critical",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            }
            ,
            {
                x: labels2,
                y: values2,
                name: "Major",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": 1.3
                }
            }
        ],
            layout: {
                title: this.Title,
                xaxis:{
                    title: "Date",
                    fixedrange: true,
                    range: [dateLowerBound, dateUpperBound]
                },
                yaxis: {
                    title: "Bugs/Day",
                    fixedrange: true,
                    range: [0, maxYVal + 1]
                },
                shapes: [
                    {
                        type: 'line',
                        xref: 'paper',
                        x0: 0,
                        y0: this._annualTarget,
                        x1: 1,
                        y1: this._annualTarget,
                        line: {
                            color: 'rgb(0, 255, 0)',
                            width: 4,
                            dash:'dot'
                        }
                    },
                    {
                        type: 'line',
                        xref: 'paper',
                        x0: 0,
                        y0: this._annualStretchGoal,
                        x1: 1,
                        y1: this._annualStretchGoal,
                        line: {
                            color: 'gold',
                            width: 4,
                            dash:'dot'
                        }
                    }
                ]
            },
            frames: [],
            config: {}
        };
    }
}