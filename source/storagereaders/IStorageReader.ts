/**
 * IStorageReader.
 * 
 * Allows reading data from a storage.
 */
export default interface IStorageReader
{
    /**
     * Initialize the storage.
     */
    Initialize(): void;

    /**
     * Query storage returning results in an array of JSON or null.
     * @param {string} sql query to run
     * @returns {Promise<any>} a Promise: results in an array of JSON, or null if error
     * @override
     */
    QueryOrNull(sql: string): any;

    /**
     * Cleanup/dispose any open resources.
     */
    Cleanup(): void;
}