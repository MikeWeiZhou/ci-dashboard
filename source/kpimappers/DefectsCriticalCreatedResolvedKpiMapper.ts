import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * DefectsCreatedResolvedKpiMapper.
 * 
 * Defects - Created vs Resolved.
 */
export class DefectsCriticalCreatedResolvedKpiMapper extends KpiMapper
{
    public readonly Category: string = "Defects";
    public readonly Title: string = "Defects (Critical) - Created vs Resolved";

    private _tablename: string = config.db.tablename.bug_resolution_dates;

    /**
     * Returns SQL query string given a date range.
     * @param {string} from date
     * @param {string} to date
     * @returns {string} SQL query string
     * @override
     */
    protected getQueryString(from: string, to: string): string
    {
        return `
        SELECT COUNT(*) AS 'COUNT',
            resolution_date AS 'RESSTATUS'
            FROM ${this._tablename} 
            WHERE CREATION_DATE BETWEEN '${from}' AND '${to}'
            and PRIORITY = 'Critical'
            GROUP BY (CASE WHEN resolution_date IS NULL THEN 1 ELSE 0 END)
        `;
    }

    /**
     * Returns a KpiState or null given an array or single JSON object containing required data.
     * @param {Array<any>} jsonArray non-empty JSON array results containing data
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     */
    protected mapToKpiStateOrNull(jsonArray: Array<any>): IKpiState|null
    {
        var values: Array<any> = [];
        var labels: Array<any> = [];


        var totalCreated:number = 0;
        var totaCreatedLabel:string = "Created";
        var resolvedLabel:string = "Resolved";

        if(jsonArray[0].RESSTATUS != "NULL") {
            totalCreated = jsonArray[0].COUNT;
            if(jsonArray.length > 1) {
                totalCreated = jsonArray[0].COUNT + jsonArray[1].COUNT;

                values.push(totalCreated);
                labels.push(totaCreatedLabel);
            }
        }

            values.push(jsonArray[0].COUNT);
            labels.push(resolvedLabel);

        return {
            data: [{
                values: values,
                labels: labels,
                type:   "bar"
            }],
            layout: {
                title: this.Title
            },
            frames: [],
            config: {}
        };
    }
}