import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const config = require("../../../config/config")
const kpigoals = require("../../../config/kpigoals")
import * as moment from "moment"

/**
 * DefectsAverageDaysToResolution.
 * 
 * Defects - Average Days to resolution for bugs completed
 */
export class DefectsAverageDaysToResolutionKpiMapper extends KpiMapper
{
    public readonly Title: string = "null";
    private _from: string;
    private _to: string;
    
    private _tablename: string = config.db.tablename.resolved_story_points;

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
        `,
        `SELECT T1.Date AS Date
        ,AVG(T2.Diff) AS Average
        FROM 
        (
            SELECT cast(DATE as date) as date
            ,SUM(RESOLVED) AS 'SUM_RESOLVED',
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
            ) as T1
            LEFT JOIN 
            (
                SELECT cast(DATE as date) as date
            ,SUM(RESOLVED) AS 'SUM_RESOLVED',
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
            ) as T2
            ON T2.Date BETWEEN
                DATE_ADD(T1.Date, INTERVAL -6 DAY) AND T1.Date
            WHERE T1.Date BETWEEN '${from}' AND '${to}'
            GROUP BY Date
            ORDER BY CAST(T1.Date AS DATE) ASC
        `,
        `SELECT T1.Date AS Date
        ,AVG(T2.Diff) AS Average
        FROM 
        (
            SELECT cast(DATE as date) as date
            ,SUM(RESOLVED) AS 'SUM_RESOLVED',
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
            ) as T1
            LEFT JOIN 
            (
                SELECT cast(DATE as date) as date
            ,SUM(RESOLVED) AS 'SUM_RESOLVED',
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
            ) as T2
            ON T2.Date BETWEEN
                DATE_ADD(T1.Date, INTERVAL -6 DAY) AND T1.Date
            WHERE T1.Date BETWEEN '${from}' AND '${to}'
            GROUP BY Date
            ORDER BY CAST(T1.Date AS DATE) ASC
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
        var dateLowerBound: string = moment(this._from).format(config.dateformat.charts);
        var dateUpperBound: string = moment(this._to).format(config.dateformat.charts);

        var maxYVal:number = jsonArrays[0][0].Average;
        var minYVal:number = 0;

        var values: Array<any>[] =[];
        var labels: Array<any>[]= [];
        var values2: Array<any>[] =[];
        var labels2: Array<any>[]= [];
        var values3: Array<any>[] =[];
        var labels3: Array<any>[]= [];
        var values4: Array<any>[] =[];
        var labels4: Array<any>[]= [];


        // jsonArrays[0].forEach(function(a){
        //     values.push(a.Average);
        //     labels.push(a.Date);
        //     if(maxYVal < a.Average) {
        //         maxYVal = a.Average
        //     }
        //     if(minYVal < a.Average) {
        //         minYVal = a.Average
        //     }
        // });
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

        jsonArrays[2].forEach(function(a){
            values3.push(a.Average);
            labels3.push(a.Date);
            if(maxYVal < a.Average) {
                maxYVal = a.Average
            }
            if(minYVal < a.Average) {
                minYVal = a.Average
            }
        });

        jsonArrays[3].forEach(function(a){
            values4.push(a.Average);
            labels4.push(a.Date);
            if(maxYVal < a.Average) {
                maxYVal = a.Average
            }
            if(minYVal < a.Average) {
                minYVal = a.Average
            }
        });

        return {
            data: [{
                values: values,
                labels: labels,
                type:   "pie"
            }],
            layout: {
                title: this.Title
            },
            frames: [],
            config: {}
        };
    }
}