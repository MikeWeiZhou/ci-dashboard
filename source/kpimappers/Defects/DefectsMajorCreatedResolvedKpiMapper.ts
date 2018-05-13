import { KpiMapper } from "../KpiMapper"
import { IKpiState } from "../IKpiState"
const config = require("../../../config/config")

/**
 * DefectsCreatedResolvedKpiMapper.
 * 
 * Defects - Created vs Resolved.
 */
export class DefectsMajorCreatedResolvedKpiMapper extends KpiMapper
{
    public readonly Title: string = "Defects (Major) - Created vs Resolved";

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
        return [`select
            CAST(CREATION_DATE AS DATE) AS Date,
            Count(CREATION_DATE) as Count
            FROM ${this._tablename}
            WHERE CREATION_DATE BETWEEN '${from}' AND '${to}'
            and priority = 'Major'
            group by CAST(CREATION_DATE AS DATE)
            order by CREATION_DATE asc;     
        `,
        `select
            CAST(RESOLUTION_DATE AS DATE) AS Date,
            Count(RESOLUTION_DATE) as Count
            FROM ${this._tablename}
            WHERE RESOLUTION_DATE BETWEEN '${from}' AND '${to}'
            and priority = 'Major'
            group by CAST(RESOLUTION_DATE AS DATE)
            order by RESOLUTION_DATE asc;    
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
        var values: Array<any> = [];
        var labels: Array<any> = [];

        var totalCreated:number = 0;
        var totaCreatedLabel:string = "Created";
        var resolvedLabel:string = "Resolved";

        if(jsonArray[0].RESSTATUS != "NULL") {
            totalCreated = jsonArray[0].COUNT;
            if(jsonArray.length > 1) {
                totalCreated = jsonArray[0].COUNT + jsonArray[1].COUNT;
            }
            values.push(totalCreated);
            labels.push(totaCreatedLabel);
        }

            values.push(jsonArray[0].COUNT);
            labels.push(resolvedLabel);

            return {
                data: [{
                    x: labels,
                    y: values,
                    type:   "bar",
                    name: this.Title
                }],
                layout: {
                    title: this.Title,
                    xaxis:{
                        title: "Defect Status",
                        fixedrange: true
                    },
                    yaxis: {
                        title: "Count",
                        fixedrange: true
                    }
                },
                frames: [],
                config: {}
            };
    }
}