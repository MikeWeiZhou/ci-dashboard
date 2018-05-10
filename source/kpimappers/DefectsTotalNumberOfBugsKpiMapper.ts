import { KpiMapper } from "./KpiMapper"
import { IKpiState } from "./IKpiState"
const config = require("../../config/config")

/**
 * DefectsTotalNumberOfBugs.
 * 
 * Defects - Total Number of Bugs
 */
export class DefectsTotalNumberOfBugsKpiMapper extends KpiMapper
{
    public readonly Category: string = "";
    public readonly Title: string = "Defects - Total Number of Bugs";

    private _tablename: string = config.db.tablename.bug_resolution_dates;

    /**
     * Returns SQL query string given a date range.
     * @param {string} from date
     * @param {string} to date
     * @param {number} dateRange between from and to dates
     * @returns {string} SQL query string
     * @override
     */
    protected getQueryString(from: string, to: string, dateRange: number): string
    {
        return `
            SELECT COUNT(*) AS 'COUNT',
            PRIORITY as 'PRIORITY'
            FROM ${this._tablename}
            WHERE CREATION_DATE BETWEEN '${from}' AND '${to}'
            GROUP BY PRIORITY
        `;
    }

    /**
     * Returns a KpiState or null given an array or single JSON object containing required data.
     * @param {Array<any>} jsonArray non-empty JSON array results containing data
     * @returns {IKpiState|null} IKpiState object or null when insufficient data
     * @override
     */
    protected mapToKpiStateOrNull(jsonArray: Array<any>): IKpiState|null
    {
        var values: Array<any> = [];
        var labels: Array<any> = [];

        for (let i: number = 0; i < jsonArray.length; ++i)
        {
            values.push(jsonArray[i].COUNT);
            labels.push(jsonArray[i].PRIORITY);
        }

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
                    title: "Defect Type",
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