// import { KpiMapper } from "../KpiMapper"
// import { IKpiState } from "../IKpiState"
// const config = require("../../../config/config")

// /**
//  * UsersStoriesTeamVelocityKpiMapper
//  * 
//  * User Stories Team Velocity
//  * Where it tracks story points per week
//  */
// export class UsersStoriesTeamVelocityKpiMapper extends KpiMapper
// {
//     public readonly Category: string = "User Stories";
//     public readonly Title: string = "Team Velocity for User Stories";

//     private _tablename: string = config.db.resolved_story_points;

//     /**
//      * Returns an array of SQL query strings given a date range.
//      * @param {string} from date
//      * @param {string} to date
//      * @param {number} dateRange between from and to dates
//      * @returns {string[]} an array of one or more SQL query string
//      * @override
//      */
//     protected getQueryStrings(from: string, to: string, dateRange: number): string[]
//     {
//         return [`
//             SELECT SUM(*) AS 'SUM',
//                    STORY_POINTS
//             FROM ${this._tablename}
//             WHERE RESOLUTION_DATE between '${from}' AND '${to}'
//             GROUP BY STORY_POINTS
//         `];
//     }

//     /**
//      * Returns a KpiState given multiple JSON arrays containing queried data.
//      * @param {Array<any>[]} jsonArrays One or more JSON array results (potentially empty arrays)
//      * @returns {IKpiState|null} IKpiState object or null when insufficient data
//      * @override
//      */
//     protected mapToKpiStateOrNull(jsonArrays: Array<any>[]): IKpiState|null
//     {
//         var jsonArray: Array<any> = jsonArrays[0];
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
//                 title: this.Title
//             },
//             frames: [],
//             config: {}
//         };
//     }
// }