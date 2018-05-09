import { IDataInterface } from "./IDataInterface"
const config = require("../../config/config");

/**
 * QaBuildsAndRunsFromBambooDataInterface.
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
    public readonly TableColumns: Array<string> =
    [
        "BUILDRESULTSUMMARY_ID",
        "MINUTES_TOTAL_QUEUE_AND_BUILD",
        "BUILD_COMPLETED_DATE",
        "CYCLE",
        "PLATFORM_CODE",
        "PRODUCT_CODE",
        "PLATFORM_NAME",
        "PRODUCT_NAME",
        "IS_DEFAULT",
        "BUILD_STATE",
        "BRANCH_ID"
    ];

    // Platform Code : Platform Name
    private readonly _platformName: object =
    {
        "WIN": "Windows",
        "LIN": "Linux",
        "MAC": "Mac"
    };

    // Product Code : Product Name
    private readonly _productName: object =
    {
        "FX": "***REMOVED***",
        "MX": "***REMOVED***",
        "DX": "***REMOVED***",
        "IC": "***REMOVED***",
        "DM": "DM"
    };

    /**
     * Returns a data record derrived from a JSON object ready to be consumed by IDataStorage.
     * Array order must match TableColumns.
     * @param {any} o original JSON object
     * @returns {Array<any>} data record as an array
     * @override
     */
    public Transform(o: any): Array<any>
    {
        // Expects JSON parse path to be "$*"" by default
        // Meaning it will wrap the original JSON with "value" and "key" properties
        o = o.value;

        // count:       012345 678 9012 34 56 7
        // BUILD_KEY    aaaaaa LAT bbb- cc 64 [d]
        // example:     S2018B LAT LIN- DX 64 45
        //              S2018A LAT WIN- FX 64
        //
        // where aaaaaa = cycle e.g. S2018B
        //          bbb = platform e.g. LIN
        //           cc = product: FX, MX, DX, IX
        //            d = branch id (if omitted, then default, otherwise unique number identifying branch)

        var platformCode: string = o.BUILD_KEY.substring(9, 12);
        var productCode: string = o.BUILD_KEY.substring(13, 15);
        var isDefault: boolean = !(o.BUILD_KEY.length > 17);

        return [
            o.BUILDRESULTSUMMARY_ID,                // BUILDRESULTSUMMARY_ID
            o.MINUTES_TOTAL_QUEUE_AND_BUILD,        // MINUTES_TOTAL_QUEUE_AND_BUILD
            o.BUILD_COMPLETED_DATE,                 // BUILD_COMPLETED_DATE
            o.BUILD_KEY.substring(0, 6),            // CYCLE aaaaaa
            platformCode,                           // PLATFORM_CODE bbb
            productCode,                            // PRODUCT_CODE cc
            this._platformName[platformCode],       // PLATFORM_NAME
            this._productName[productCode],         // PRODUCT_NAME
            (isDefault) ? 1 : 0,                    // IS_DEFAULT [d]
            o.BUILD_STATE,                          // BUILD_STATE
            (isDefault) ? null : o.BUILD_KEY.substring(17) // BRANCH_ID [d]
        ];
    }
}