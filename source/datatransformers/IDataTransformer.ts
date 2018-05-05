/**
 * IDataTransformer.
 * 
 * Transforms a JSON object into a data array.
 */
export interface IDataTransformer
{
    /** Table name for data set. */
    readonly TableName: string;

    /** Table keys/fields for data set. Order must match data array returned from Transform(). */
    readonly TableKeys: Array<string>;

    /**
     * Returns a data array. Order must match TableKeys.
     * @param {any} o original JSON object
     * @returns {Array<any>} data array
     */
    Transform(o: any): Array<any>;
}