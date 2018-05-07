/**
 * IDataInterface.
 * 
 * Contains data model and able to transform raw JSON object to that model.
 */
export interface IDataInterface
{
    /**
     * Table name for data set.
     */
    readonly TableName: string;

    /**
     * Table columns for data set.
     * Order must match data array returned from Transform().
     */
    readonly TableColumns: Array<string>;

    /**
     * SQL query that setup the database.
     */
    readonly DbSetupQuery: string;

    /**
     * Returns a data record derrived from a JSON object ready to be consumed by IDataStorage.
     * Order must match TableColumns.
     * @param {any} o original JSON object
     * @returns {Array<any>} data record as an array
     */
    Transform(o: any): Array<any>;
}