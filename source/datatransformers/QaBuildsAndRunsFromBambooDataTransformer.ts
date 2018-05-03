import IDataTransformer from "./IDataTransformer"

/**
 * QaBuildsAndRunsFromBambooDataTransformer.
 * 
 * Returns only the wanted properties from original JSON.
 */
export default class QaBuildsAndRunsFromBambooDataTransformer implements IDataTransformer
{
    public constructor()
    {
    }

    /**
     * Returns only the wanted properties from original JSON.
     * @param {any} o original JSON record
     * @returns {any} a transformed JSON record
     * @override
     */
    public Transform(o: any): any
    {
        // BUILD_KEY is aaaaaaLATbbb-ccX64[d]
        //              012345678901234567
        // where aaaaaa = cycle e.g. S2018B
        //          bbb = platform e.g. LIN
        //           cc = product: FX, MX, DX, IX
        //            d = branch id (if omitted, then master, otherwise unique number identifying branch)

        return {
            MINUTES_TOTAL_QUEUE_AND_BUILD:  o.MINUTES_TOTAL_QUEUE_AND_BUILD,
            BUILD_COMPLETED_DATE:           o.BUILD_COMPLETED_DATE,
            PLATFORM:                       o.BUILD_KEY.substring(9, 12),       // bbb
            PRODUCT:                        o.BUILD_KEY.substring(13, 15),      // cc
            IS_MASTER:                      (o.BUILD_KEY.length == 18) ? 0 : 1, // [d]
            IS_SUCCESS:                     (o.BUILD_STATE == "Failed") ? 0 : 1
        };
    }
}