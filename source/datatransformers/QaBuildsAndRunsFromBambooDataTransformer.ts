import { IDataTransformer } from "./IDataTransformer"
const config = require("../../config/config");

/**
 * QaBuildsAndRunsFromBambooDataTransformer.
 * 
 * Returns only the wanted properties from original JSON.
 */
export class QaBuildsAndRunsFromBambooDataTransformer implements IDataTransformer
{
    /**
     * Table name for data set.
     * @override
     */
    public readonly TableName: string = config.db.tablenames.qa_builds_and_runs_from_bamboo;

    /**
     * Table keys/fields for data set.
     * Order must match data array returned from Transform().
     * @override
     */
    public readonly TableKeys: Array<string> = ["MINUTES_TOTAL_QUEUE_AND_BUILD", "BUILD_COMPLETED_DATE", "CYCLE", "PLATFORM", "PRODUCT", "IS_DEFAULT", "IS_SUCCESS", "BRANCH_ID"];

    private readonly _DEFAULT_BRANCH_ID: number = -1;

    /**
     * Returns a data array.
     * Order must match TableKeys.
     * @param {any} o original JSON object
     * @returns {Array<any>} data array
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

        var values: Array<any> = [];
        values.push(o.MINUTES_TOTAL_QUEUE_AND_BUILD);       // MINUTES_TOTAL_QUEUE_AND_BUILD
        values.push(o.BUILD_COMPLETED_DATE);                // BUILD_COMPLETED_DATE
        values.push(o.BUILD_KEY.substring(0, 6));           // CYCLE aaaaaa
        values.push(o.BUILD_KEY.substring(9, 12));          // PLATFORM bbb
        values.push(o.BUILD_KEY.substring(13, 15));         // PRODUCT cc
        values.push((o.BUILD_KEY.length > 17) ? 0 : 1);     // IS_DEFAULT [d]
        values.push((o.BUILD_STATE == "Failed") ? 0 : 1);   // IS_SUCCESS
        values.push((o.BUILD_KEY.length > 17)               // BRANCH_ID [d]
            ? o.BUILD_KEY.substring(17)
            : this._DEFAULT_BRANCH_ID
            );
        return values;
    }
}