import { IDataInterface } from "./IDataInterface"
const config = require("../../config/config");

/**
 * QaBuildsAndRunsFromBambooDataInterface.
 * 
 * Contains data model and able to transform raw JSON object to that model.
 */
export class QaBuildsAndRunsFromBambooDataInterface implements IDataInterface
{
    /**
     * Table name for data set.
     * @override
     */
    public readonly TableName: string = config.db.tablename.qa_builds_and_runs_from_bamboo;

    /**
     * Table columns for data set.
     * Order must match data array returned from Transform().
     * @override
     */
    public readonly TableColumns: Array<string> = ["BUILDRESULTSUMMARY_ID", "MINUTES_TOTAL_QUEUE_AND_BUILD", "BUILD_COMPLETED_DATE", "CYCLE", "PLATFORM", "PRODUCT", "IS_DEFAULT", "IS_SUCCESS", "BRANCH_ID"];

    private readonly _NO_BRANCH_ID: number = -1;

    /**
     * Returns a data record derrived from a JSON object ready to be consumed by IDataStorage.
     * Array order must match TableColumns.
     * @param {any} o original JSON object
     * @returns {Array<any>} data record as an array
     * @override
     */
    public Transform(o: any): Array<any>
    {
        // count:       012345 678 9012 34 56 7
        // BUILD_KEY is aaaaaa LAT bbb- cc 64 [d]
        // example:     S2018B LAT LIN- DX 64 45
        //              S2018A LAT WIN- FX64
        //
        // where aaaaaa = cycle e.g. S2018B
        //          bbb = platform e.g. LIN
        //           cc = product: FX, MX, DX, IX
        //            d = branch id (if omitted, then default, otherwise unique number identifying branch)

        return [
            o.BUILDRESULTSUMMARY_ID,                // BUILDRESULTSUMMARY_ID
            o.MINUTES_TOTAL_QUEUE_AND_BUILD,        // MINUTES_TOTAL_QUEUE_AND_BUILD
            o.BUILD_COMPLETED_DATE,                 // BUILD_COMPLETED_DATE
            o.BUILD_KEY.substring(0, 6),            // CYCLE aaaaaa
            o.BUILD_KEY.substring(9, 12),           // PLATFORM bbb
            o.BUILD_KEY.substring(13, 15),          // PRODUCT cc
            (o.BUILD_KEY.length > 17) ? 0 : 1,      // IS_DEFAULT [d]
            (o.BUILD_STATE == "Failed") ? 0 : 1,    // IS_SUCCESS
            (o.BUILD_KEY.length > 17) ? o.BUILD_KEY.substring(17) : this._NO_BRANCH_ID // BRANCH_ID [d]
        ];
    }
}