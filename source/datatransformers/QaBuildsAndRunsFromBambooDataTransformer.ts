import { IDataTransformer } from "./IDataTransformer"
const config = require("../../config/config");

/**
 * QaBuildsAndRunsFromBambooDataTransformer.
 * 
 * Returns only the wanted properties from original JSON.
 */
export class QaBuildsAndRunsFromBambooDataTransformer implements IDataTransformer
{
    /** Table name for data set. */
    public readonly TableName: string = config.db.tablenames.qa_builds_and_runs_from_bamboo;

    /** Table keys/fields for data set. Order must match data array returned from Transform(). */
    readonly TableKeys: Array<string> = ["MINUTES_TOTAL_QUEUE_AND_BUILD", "BUILD_COMPLETED_DATE", "PLATFORM", "PRODUCT", "IS_MASTER", "IS_SUCCESS"];

    /**
     * Returns a data array. Order must match TableKeys.
     * @param {any} o original JSON object
     * @returns {Array<any>} data array
     * @override
     */
    public Transform(o: any): Array<any>
    {
        // BUILD_KEY is aaaaaaLATbbb-ccX64[d]
        //              012345678901234567
        // where aaaaaa = cycle e.g. S2018B
        //          bbb = platform e.g. LIN
        //           cc = product: FX, MX, DX, IX
        //            d = branch id (if omitted, then master, otherwise unique number identifying branch)

        var values: Array<any> = [];
        values.push(o.MINUTES_TOTAL_QUEUE_AND_BUILD);       // MINUTES_TOTAL_QUEUE_AND_BUILD
        values.push(o.BUILD_COMPLETED_DATE);                // BUILD_COMPLETED_DATE
        values.push(o.BUILD_KEY.substring(9, 12));          // PLATFORM bbb
        values.push(o.BUILD_KEY.substring(13, 15));         // PRODUCT cc
        values.push((o.BUILD_KEY.length == 18) ? 0 : 1);    // IS_MASTER [d]
        values.push((o.BUILD_STATE == "Failed") ? 0 : 1);   // IS_SUCCESS
        return values;
    }
}