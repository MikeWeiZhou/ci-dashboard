import * as moment from "moment"
import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
import { isNull } from "util";
import { SimpleMovingAveragePeriod } from "../SimpleMovingAveragePeriod"
import { GenerateDatesSubquery } from "../GenerateDatesSubquery"
const config = require("../../../config/config")

/**
 * DefectsCreatedResolvedKpiMapper.
 * Created vs Resolved.
 * 
 * Description of Method:
 * 
 * The total created and resolved bugs for a day are used in computing the difference. 
 * Dates with exclusively either created or resolved bugs (XOR), but not both, will 
 * compute the difference with a 0 value for the other type.
 * Dates without any created and resolved bugs will assume a value of 0.
 * Such dates are accounted for in the simple moving average.
 */
export class DefectsCriticalCreatedResolvedKpiMapper extends KpiMapper
{
   // private counter:number = 0;
    public readonly Title: string = "Difference (Resolved - Created)";

    private _tablename: string = config.db.tablename.bug_resolution_dates;
    private _dateRange: number;
    private _annualTarget: number = config.kpi.goals.bugs_rc_difference.target;
    private _annualStretchGoal: number = config.kpi.goals.bugs_rc_difference.stretch;

    private _from: string;
    private _to: string;

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
			(SELECT datetbl.Date AS Date, ifnull(t1.diff, 0) as value     
				FROM ${generateDatesSubquery} as datetbl
				left join
				(
				SELECT cast(DATE as date) as date,
						SUM(RESOLVED) AS 'SUM_RESOLVED',
						SUM(CREATED) AS 'SUM_CREATED',
						sum(resolved)-sum(created) as Diff
						FROM
						(
							SELECT cast(creation_date as date) AS 'DATE'
								,1 AS 'CREATED'
								,0 AS 'RESOLVED'
								,PRIORITY
							FROM ${this._tablename}
							UNION ALL
							SELECT cast(resolution_date as date) AS 'DATE'
								,0 AS 'CREATED'
								,1 AS 'RESOLVED'
								,PRIORITY
							FROM ${this._tablename}
							WHERE RESOLUTION_DATE IS NOT NULL
							and priority = 'Critical'
						) T1a
						GROUP BY cast(DATE as date)
				) T1
				ON datetbl.date = t1.date
				where datetbl.Date between'${from}' AND '${to}'
				) T2
				left join
			    (SELECT datetbl.Date AS Date, ifnull(t1.diff, 0) as value     
				FROM ${generateDatesSubquery} as datetbl
				left join
				(
				SELECT cast(DATE as date) as date,
						SUM(RESOLVED) AS 'SUM_RESOLVED',
						SUM(CREATED) AS 'SUM_CREATED',
						sum(resolved)-sum(created) as Diff
						FROM
						(
							SELECT cast(creation_date as date) AS 'DATE'
								,1 AS 'CREATED'
								,0 AS 'RESOLVED'
								,PRIORITY
							FROM ${this._tablename}
							UNION ALL
							SELECT cast(resolution_date as date) AS 'DATE'
								,0 AS 'CREATED'
								,1 AS 'RESOLVED'
								,PRIORITY
							FROM ${this._tablename}
							WHERE RESOLUTION_DATE IS NOT NULL
							and priority = 'Critical'
						) T1a
						GROUP BY cast(DATE as date)
				) T1
				ON datetbl.date = t1.date
				where datetbl.Date between '${from}' AND '${to}'
				) T3
				 ON T3.Date BETWEEN
                 DATE_ADD(T2.Date, INTERVAL -${window} DAY) AND T2.Date
				WHERE T2.Date BETWEEN '${from}' AND '${to}'
				GROUP BY Date
				ORDER BY CAST(T2.Date AS DATE) ASC;
				
        `,
        `
        SELECT T2.Date AS Date
            , (case when AVG(T3.value) then AVG(T3.value) else 0 end) as Average
            FROM 
			(SELECT datetbl.Date AS Date, ifnull(t1.diff, 0) as value     
				FROM ${generateDatesSubquery} as datetbl
				left join
				(
				SELECT cast(DATE as date) as date,
						SUM(RESOLVED) AS 'SUM_RESOLVED',
						SUM(CREATED) AS 'SUM_CREATED',
						sum(resolved)-sum(created) as Diff
						FROM
						(
							SELECT cast(creation_date as date) AS 'DATE'
								,1 AS 'CREATED'
								,0 AS 'RESOLVED'
								,PRIORITY
							FROM ${this._tablename}
							UNION ALL
							SELECT cast(resolution_date as date) AS 'DATE'
								,0 AS 'CREATED'
								,1 AS 'RESOLVED'
								,PRIORITY
							FROM ${this._tablename}
							WHERE RESOLUTION_DATE IS NOT NULL
							and priority = 'Major'
						) T1a
						GROUP BY cast(DATE as date)
				) T1
				ON datetbl.date = t1.date
				where datetbl.Date between'${from}' AND '${to}'
				) T2
				left join
			    (SELECT datetbl.Date AS Date, ifnull(t1.diff, 0) as value     
				FROM ${generateDatesSubquery} as datetbl
				left join
				(
				SELECT cast(DATE as date) as date,
						SUM(RESOLVED) AS 'SUM_RESOLVED',
						SUM(CREATED) AS 'SUM_CREATED',
						sum(resolved)-sum(created) as Diff
						FROM
						(
							SELECT cast(creation_date as date) AS 'DATE'
								,1 AS 'CREATED'
								,0 AS 'RESOLVED'
								,PRIORITY
							FROM ${this._tablename}
							UNION ALL
							SELECT cast(resolution_date as date) AS 'DATE'
								,0 AS 'CREATED'
								,1 AS 'RESOLVED'
								,PRIORITY
							FROM ${this._tablename}
							WHERE RESOLUTION_DATE IS NOT NULL
							and priority = 'Major'
						) T1a
						GROUP BY cast(DATE as date)
				) T1
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

        var jsonArray: Array<any> = jsonArrays[0];
        var values: Array<any> =[];
        var labels: Array<any> = [];
        var values2: Array<any> =[];
        var labels2: Array<any>= [];

        var maxYVal:number = jsonArray[0].Diff;
        var minYVal:number = 0;

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

        // for (let i: number = 0; i < jsonArray.length; i++)
        // {
        //     if(jsonArray[i].CheckDups == null) {
        //          values.push(jsonArray[i].Diff);
        //          labels.push(jsonArray[i].Date);
        //     }
        // }

        // var sectionLen = Math.floor(this._dateRange/values.length);

        // for (let i: number = 0; i < labels.length; i++)
        // {
        //     var tempArr:Array<any> =[];

        //     var runningSum:number = 0;
        //     tempArr.push(values[i]);
        //     if(i % sectionLen == 0) {
        //         runningSum = tempArr.reduce(function(cur, val){
        //             return cur+val;
        //         });
        //         values2.push(runningSum/sectionLen);
        //         labels2.push(labels[i]); 

        //         if(maxYVal < runningSum/sectionLen) {
        //             maxYVal = runningSum/sectionLen;
        //         }

        //         if(minYVal > runningSum/sectionLen) {
        //             minYVal = runningSum/sectionLen;
        //         }
        //     }
        // }

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
                    title: "R-C",
                    fixedrange: true,
                    range: [minYVal - .5, maxYVal + .5]
                },
                shapes: [
                    {
                        type: 'line',
                        xref: 'paper',
                        x0: 0,
                        y0: this._annualTarget/365,
                        x1: 1,
                        y1: this._annualTarget/365,
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
                        y0: this._annualStretchGoal/365,
                        x1: 1,
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
            config: {}
        };
    }
}