import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
import { isNull } from "util";
const kpigoals = require("../../../config/kpigoals")
const config = require("../../../config/config")
import * as moment from "moment"


/**
 * DefectsCreatedResolvedKpiMapper.
 * 
 * Defects - Created vs Resolved.
 */
export class DefectsCriticalCreatedResolvedKpiMapper extends KpiMapper
{
   // private counter:number = 0;
    public readonly Title: string = "Defects (Critical) - Resolved/Created Difference";

    private _tablename: string = config.db.tablename.bug_resolution_dates;
    private _dateRange: number;
    private _annualTarget: number = kpigoals.bugs_rc_difference.target;
    private _annualStretchGoal: number = kpigoals.bugs_rc_difference.stretch;

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

        this._dateRange = dateRange;
        return [
            `select 
                NULL, NULL as CheckDups,
                (case when resolutiondate is null then creationdate else resolutiondate end) as Date,
                (case when numresolved is null then 0 else numresolved end)
                - (case when numcreated is null then 0 else numcreated end) as Diff
                from
                    (SELECT 
                    CAST(CREATION_DATE AS DATE) as CreationDate,
                    Count(CREATION_DATE) as 'NumCreated'
                    FROM ${this._tablename}
                    WHERE CREATION_DATE BETWEEN '${from}' AND '${to}'
                    and priority = 'Critical'
                    group by CAST(CREATION_DATE AS DATE)) as a
                left join
                    (SELECT 
                    CAST(resolution_date AS DATE) as 'ResolutionDate',
                    Count(resolution_date) as 'NumResolved'
                    FROM ${this._tablename}
                    WHERE resolution_date BETWEEN '${from}' AND '${to}'
                    and priority = 'Critical'
                    group by CAST(resolution_date AS DATE)) as b
                on a.creationdate = b.resolutiondate 
			union all
			select * from
                (SELECT 
                    CAST(CREATION_DATE AS DATE) as CreationDate,
                    Count(CREATION_DATE) as 'NumCreated'
                    FROM ${this._tablename}
                    WHERE CREATION_DATE BETWEEN '${from}' AND '${to}'
                    and priority = 'Critical'
                    group by CAST(CREATION_DATE AS DATE)) as a
                right join
                (SELECT 
                    CAST(resolution_date AS DATE) as 'ResolutionDate',
                    Count(resolution_date) as 'NumResolved'
                    FROM ${this._tablename}
                    WHERE resolution_date BETWEEN '${from}' AND '${to}'
                    and priority = 'Critical'
                    group by CAST(resolution_date AS DATE)) as b
                on a.creationdate = b.resolutiondate
                order by Date
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

        for (let i: number = 0; i < jsonArray.length; i++)
        {
            if(jsonArray[i].CheckDups == null) {
                 values.push(jsonArray[i].Diff);
                 labels.push(jsonArray[i].Date);
            }
        }

        var sectionLen = Math.floor(this._dateRange/values.length);

        for (let i: number = 0; i < labels.length; i++)
        {
            var tempArr:Array<any> =[];

            var runningSum:number = 0;
            tempArr.push(values[i]);
            if(i % sectionLen == 0) {
                runningSum = tempArr.reduce(function(cur, val){
                    return cur+val;
                });
                values2.push(runningSum/sectionLen);
                labels2.push(labels[i]); 

                if(maxYVal < runningSum/sectionLen) {
                    maxYVal = runningSum/sectionLen;
                }

                if(minYVal > runningSum/sectionLen) {
                    minYVal = runningSum/sectionLen;
                }
            }
        }

        return {
            data: [{
                x: labels2,
                y: values2,
                name: "R-C",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": .8
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
                    range: [-2, maxYVal + 1]
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