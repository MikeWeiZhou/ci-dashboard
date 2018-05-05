// import IKpi from "./IKpi"
// import MySqlStorage from "../storages/MySqlStorage"

// /**
//  * IKpi.
//  */
// export default class QaBuildSuccessPerPlatform implements IKpi
// {
//     /**
//      * Returns a Plotly state object.
//      */
//     async GetPlotlyState(): Promise<any>
//     {
//         var storage: MySqlStorage = new MySqlStorage("localhost", "cidashboard", "root", "");
//         // var sql: string = `
//         //     SELECT PLATFORM, (SELECT COUNT(*) 
//         //                         FROM qa_builds_and_runs_from_bamboo 
//         //                         WHERE IS_SUCCESS = 1
//         //                         AND PLATFORM = a.PLATFORM)
//         //                         / COUNT(*) AS 'Success Rate'
//         //     FROM qa_builds_and_runs_from_bamboo a
//         //     GROUP BY PLATFORM
//         //     `;


//         // var sql: string = `
//         //     SELECT PRODUCT, (SELECT COUNT(*) 
//         //                         FROM qa_builds_and_runs_from_bamboo 
//         //                         WHERE IS_SUCCESS = 1
//         //                         AND PRODUCT = a.PRODUCT)
//         //                         / COUNT(*) AS 'Success Rate'
//         //     FROM qa_builds_and_runs_from_bamboo a
//         //     GROUP BY PRODUCT
//         //     `;




//         var sql: string = `
//             SELECT PRODUCT, PLATFORM, (SELECT COUNT(*) 
//                                 FROM qa_builds_and_runs_from_bamboo 
//                                 WHERE IS_SUCCESS = 1
//                                 AND PRODUCT = a.PRODUCT
//                                 AND PLATFORM = a.PLATFORM)
//                                 / COUNT(*) AS 'Success Rate'
//             FROM qa_builds_and_runs_from_bamboo a
//             GROUP BY PRODUCT, PLATFORM
//             `;
//         var results: any = await storage.QueryOrNull(sql);

//         if (results == null)
//         {
//             return;
//         }

//         console.log(results);

//         // var successCount: number = 0;
//         // var failCount: number = 0;

//         // for (var i: number = 0; i < results.length; ++i)
//         // {
//         //     if (results[i].IS_SUCCESS == 1)
//         //         ++successCount;
//         //     else
//         //         ++failCount;
//         // }

//         // var state =
//         // {
//         //     data: [{
//         //         x: ['LIN', 'MAC', 'WIN'],
//         //         y: [0.553, 0.342, 0.3424],
//         //         type: 'bar'
//         //     }],
//         //     layout: {
//         //         title: "QA Platform Build Success Rate"
//         //     },
//         //     frames: [],
//         //     config: {}
//         // };

//         // console.log("success: " + successCount + " || fail: " + failCount);
//         // console.log(state);
//         // console.log("values:");
//         // console.log([successCount, failCount]);
//         // console.log("labels:");
//         // console.log(["Success", "Fail"]);

//         return null;
//     }
// }