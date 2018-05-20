import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
import { SimpleMovingAveragePeriod } from "../SimpleMovingAveragePeriod"
import { GenerateDatesSubquery } from "../GenerateDatesSubquery"
const kpi = require("../../../config/kpi")
const config = require("../../../config/config")

/**
 * DefectsTotalBugsResolved.
 * Number of Bugs Resolved
 * 
 * Description of Method:
 * 
 * The bug count is applied if resolution(s) occurred on that day.
 * It is assumed that no bugs were resolved on dates that do not exist and when 
 * resolution dates are nulled.
 * The simple moving average accounts for such days with no resolutions.
 */
export class DefectsTotalBugsResolvedKpiMapper extends KpiMapper
{
    private _from: string;
    private _to: string;

    public readonly Title: string = "Bugs Resolved/Day";

    private _tablename: string = config.db.tablename.bug_resolution_dates;
    private _annualTarget: number = kpi.goals.bugs_per_day.target;
    private _annualStretchGoal: number = kpi.goals.bugs_per_day.stretch;

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

        var window: number = SimpleMovingAveragePeriod.GetPeriod(dateRange);
        var generateDatesSubquery: string = GenerateDatesSubquery.GetQuery(from, to);

        return [
            `          
            SELECT T2.Date AS Date
            , (case when AVG(T3.value) then AVG(T3.value) else 0 end) as Average
            FROM 
			(SELECT datetbl.Date AS Date, ifnull(t1.value, 0) as value     
				FROM ${generateDatesSubquery} as datetbl
				left join
				(
					SELECT
					CAST(RESOLUTION_DATE AS DATE) AS Date,
					COUNT(RESOLUTION_DATE) AS Value,
					PRIORITY
					FROM ${this._tablename}
					WHERE RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
					AND PRIORITY = 'Critical'
					GROUP BY 1
				) as T1	
				ON datetbl.date = t1.date
				where datetbl.Date between '${from}' AND '${to}'
				) T2
				left join
			    (SELECT datetbl.Date AS Date, ifnull(t1.value, 0) as value     
				FROM ${generateDatesSubquery} as datetbl
				left join
				(
					SELECT
					CAST(RESOLUTION_DATE AS DATE) AS Date,
					COUNT(RESOLUTION_DATE) AS Value,
					PRIORITY
					FROM ${this._tablename}
					WHERE RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
					AND PRIORITY = 'Critical'
					GROUP BY 1
				) as T1	
				ON datetbl.date = t1.date
				where datetbl.Date between '${from}' AND '${to}'
				) T3
				 ON T3.Date BETWEEN
                 DATE_ADD(T2.Date, INTERVAL -${window} DAY) AND T2.Date
				WHERE T2.Date BETWEEN '${from}' AND '${to}'
				GROUP BY Date
				ORDER BY CAST(T2.Date AS DATE) ASC
            `,
            `
            SELECT T2.Date AS Date
            , (case when AVG(T3.value) then AVG(T3.value) else 0 end) as Average
            FROM 
			(SELECT datetbl.Date AS Date, ifnull(t1.value, 0) as value     
				FROM ${generateDatesSubquery} as datetbl
				left join
				(
					SELECT
					CAST(RESOLUTION_DATE AS DATE) AS Date,
					COUNT(RESOLUTION_DATE) AS Value,
					PRIORITY
					FROM ${this._tablename}
					WHERE RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
					AND PRIORITY = 'Major'
					GROUP BY 1
				) as T1	
				ON datetbl.date = t1.date
				where datetbl.Date between '${from}' AND '${to}'
				) T2
				left join
			    (SELECT datetbl.Date AS Date, ifnull(t1.value, 0) as value     
				FROM ${generateDatesSubquery} as datetbl
				left join
				(
					SELECT
					CAST(RESOLUTION_DATE AS DATE) AS Date,
					COUNT(RESOLUTION_DATE) AS Value,
					PRIORITY
					FROM ${this._tablename}
					WHERE RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
					AND PRIORITY = 'Major'
					GROUP BY 1
				) as T1	
				ON datetbl.date = t1.date
				where datetbl.Date between '${from}' AND '${to}'
				) T3
				 ON T3.Date BETWEEN
                 DATE_ADD(T2.Date, INTERVAL -${window} DAY) AND T2.Date
				WHERE T2.Date BETWEEN '${from}' AND '${to}'
				GROUP BY Date
				ORDER BY CAST(T2.Date AS DATE) ASC
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

       // console.log(labels);
       // console.log(labels2);

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
                    title: "Bugs Resolved/Day",
                    fixedrange: true,
                    range: [0-.5, maxYVal + .5]
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