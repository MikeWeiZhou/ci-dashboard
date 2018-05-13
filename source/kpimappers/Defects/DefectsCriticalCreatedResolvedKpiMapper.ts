import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const config = require("../../../config/config")

/**
 * DefectsCreatedResolvedKpiMapper.
 * 
 * Defects - Created vs Resolved.
 */
export class DefectsCriticalCreatedResolvedKpiMapper extends KpiMapper
{
   // private counter:number = 0;
    public readonly Title: string = "Defects (Critical) - Created vs Resolved";

    private _tablename: string = config.db.tablename.bug_resolution_dates;

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
        return [
            `select tbl.date as Date,
            tbl.value as Count,
            avg(pasttbl.value) as Average
            from (
                select
                CAST(CREATION_DATE AS DATE) as date,
                count(CREATION_DATE) as value,
                priority
                from ${this._tablename}
                WHERE CREATION_DATE BETWEEN '${from}' AND '${to}'
                and priority = 'Critical'
                group by 1
            ) as tbl
            inner join (
                select
                CAST(CREATION_DATE AS DATE) as date,
                count(CREATION_DATE) as value,
                priority
                from ${this._tablename}
                group by 1
            ) as pasttbl
            on pasttbl.date between tbl.date - 6 and tbl.date
            group by 1, 2
            order by CAST(tbl.date AS DATE) asc
            `,
            `select tbl.date as Date,
            tbl.value as Count,
            avg(pasttbl.value) as Average
            from (
                select
                CAST(CREATION_DATE AS DATE) as date,
                count(CREATION_DATE) as value,
                priority
                from ${this._tablename}
                WHERE CREATION_DATE BETWEEN '${from}' AND '${to}'
                and priority = 'Major'
                group by 1
            ) as tbl
            inner join (
                select
                CAST(CREATION_DATE AS DATE) as date,
                count(CREATION_DATE) as value,
                priority
                from ${this._tablename}
                group by 1
            ) as pasttbl
            on pasttbl.date between tbl.date - 6 and tbl.date
            group by 1, 2
            order by CAST(tbl.date AS DATE) asc
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
        var values: Array<any>[] =[];
        var labels: Array<any>[]= [];
        var values2: Array<any>[] =[];
        var labels2: Array<any>[]= [];

        jsonArrays[0].forEach(function(a){
            values.push(a.Average);
            labels.push(a.Date);
        });
        jsonArrays[1].forEach(function(a){
            values2.push(a.Count);
            labels2.push(a.Date);
        });

        return {
            data: [{
                x: labels,
                y: values,
                name: "Created",
                type: "scatter",
                mode: "lines",
                line: {
                    "shape": "spline",
                    "smoothing": .8
                }
            }
            ,
            {
                x: labels2,
                y: values2,
                name: "Resolved",
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
                },
                yaxis: {
                    title: "Bugs/Day",
                    fixedrange: true
                }
            },
            frames: [],
            config: {}
        };
    }
}