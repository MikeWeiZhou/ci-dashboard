import IKpi from "./IKpi"
import MySqlStorageReader from "../storagereaders/MySqlStorageReader"

/**
 * IKpi.
 */
export default class QaOverallBuildSuccessKpi implements IKpi
{
    /**
     * Returns a Plotly state object.
     */
    async GetPlotlyState(): Promise<any>
    {
        var reader: MySqlStorageReader = new MySqlStorageReader("localhost", "cidashboard", "root", "");
        var sql: string = "SELECT * FROM qa_builds_and_runs_from_bamboo";
        var results: any = await reader.QueryOrNull(sql);

        if (results == null)
        {
            return;
        }

        var successCount: number = 0;
        var failCount: number = 0;

        for (var i: number = 0; i < results.length; ++i)
        {
            if (results[i].IS_SUCCESS == 1)
                ++successCount;
            else
                ++failCount;
        }

        var state =
        {
            data: [{
                values: [successCount, failCount],
                labels: ["Success", "Fail"],
                type:   "pie"
            }],
            layout: {
                title: "QA Overall Build Success vs Fail"
            },
            frames: [],
            config: {}
        };

        console.log("success: " + successCount + " || fail: " + failCount);
        console.log(state);

        return state;
    }
}