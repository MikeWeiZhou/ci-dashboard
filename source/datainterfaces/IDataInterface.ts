/**
 * IDataInterface.
 * 
 * Contains structure of a data set and able to transform raw JSON object to that structure.
 */
export interface IDataInterface
{
    /**
     * Table name for data set.
     */
    readonly TableName: string;

    /**
     * Table keys/fields for data set.
     * Order must match data array returned from Transform().
     */
    readonly TableKeys: Array<string>;

    /**
     * SQL query that setup the database.
     */
    readonly DbSetupQuery: string;

    /**
     * Returns a data array.
     * Order must match TableKeys.
     * @param {any} o original JSON object
     * @returns {Array<any>} data array
     */
    Transform(o: any): Array<any>;
}