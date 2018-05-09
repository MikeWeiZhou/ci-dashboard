// import { KpiMapper } from "./KpiMapper"
// import { IKpiState } from "./IKpiState"
// const config = require("../../config/config")

// /**
//  * DefectsTotalNumberOfBugs.
//  * 
//  * Defects - Total Number of Bugs
//  */
// export class DefectsTotalNumberOfBugsKpiMapper extends KpiMapper
// {
//     private _tablename: string = config.db.tablename.resolved_story_points;
//     private _title: string = "Defects - Total Number of Bugs";

//     /**
//      * Returns SQL query string given a date range.
//      * @param {string} from date
//      * @param {string} to date
//      * @returns {string} SQL query string
//      * @override
//      */
//     protected GetQueryString(from: string, to: string): string
//     {
//         return `
//             SELECT COUNT(*) AS 'COUNT',
//                    IS_DEFAULT
//             FROM ${this._tablename}
//             WHERE BUILD_COMPLETED_DATE BETWEEN '${from}' AND '${to}'
//             GROUP BY IS_DEFAULT
//         `;
//     }

//     /**
//      * Returns a KpiState or null given an array or single JSON object containing required data.
//      * @param {Array<any>} jsonArray non-empty JSON array results containing data
//      * @returns {IKpiState|null} IKpiState object or null when insufficient data
//      */
//     protected MapToKpiStateOrNull(jsonArray: Array<any>): IKpiState|null
//     {
//         var values: Array<any> = [];
//         var labels: Array<any> = [];

//         for (let i: number = 0; i < jsonArray.length; ++i)
//         {
//             values.push(jsonArray[i].COUNT);
//             labels.push(jsonArray[i].IS_DEFAULT);
//         }

//         return {
//             data: [{
//                 values: values,
//                 labels: labels,
//                 type:   "pie"
//             }],
//             layout: {
//                 title: this._title
//             },
//             frames: [],
//             config: {}
//         };
//     }
// }