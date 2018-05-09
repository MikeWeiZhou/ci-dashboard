// import { KpiMapper } from "./KpiMapper"
// import { IKpiState } from "./IKpiState"
// const config = require("../../config/config")

// /**
//  * UsersStoriesTeamVelocity
//  * 
//  * User Stories Team Velocity
//  * Where it tracks story points per week
//  */
// export class UsersStoriesTeamVelocity extends KpiMapper
// {
//     private _tablename: string = config.db.resolved_story_points;
//     private _title: string = "User Stories for Team Velocity";

//     /**
//      * Returns SQL query string given a date range
//      * @param {string} from date
//      * @param {string} to date
//      * @return {string} SQL query string
//      * @override
//      */
//     protected GetQueryString(from: string, to:string)
//     {
//         return `
//         SELECT SUM(*) AS 'SUM',
//             STORY_POINTS
//         FROM ${this._tablename}
//         WHERE RESOLUTION_DATE between '${from}' AND '${to}'
//         GROUP BY STORY_POINTS
//         `;
//     }

// /**
//  * Returns a KpiState or null given an array or single JSON object containing required data.
//      * @param {Array<any>} jsonArray non-empty JSON array results containing data
//      * @returns {IKpiState|null} IKpiState object or null when insufficient data
//  */
// protected MapToKpiStateOrNull(jsonArray: Array<any>): IKpiState|null
//     {
//         var values: Array<any> = [];
//         var labels: Array<any> = [];

//         for (let i: number = 0; i < jsonArray.length; ++i)
//         {
//             values.push(jsonArray[i].SUM);
//             labels.push(jsonArray[i].STORY_POINTS);
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