/**
 * IDataTransformer.
 * 
 * Transforms a JSON object into a SQL values array.
 */
export interface IDataTransformer
{
    /** Table name for data set. */
    readonly TableName: string;

    /** Table keys/fields for data set. */
    readonly TableKeys: Array<string>;

    /**
     * Returns a SQL values array.
     * @param {any} o original JSON object
     * @returns {Array<any>} SQL values array
     */
    Transform(o: any): Array<any>;
}