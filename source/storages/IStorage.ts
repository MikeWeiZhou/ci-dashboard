/**
 * IStorage.
 * 
 * Allows writing data to a storage medium.
 */
export default interface IStorage
{
    /**
     * Initialize storage medium.
     * @async
     * @returns {Promise<any>} not used
     * @throws {any} Error if failed to connect
     */
    Initialize(): Promise<any>;

    /**
     * Query storage returning results as JSON array or null.
     * @async
     * @param {string} sql query to run
     * @returns {Promise<any>} results as JSON array or null
     */
    QueryOrNull(sql: string): Promise<any>;

    /**
     * Write a JSON object to table in storage.
     * @async
     * @param {string} table name
     * @param {any} jsonObject data to be written to table, must be flat (one-level)
     * @returns {Promise<boolean>} true if write successful, false otherwise
     */
    Write(table: string, jsonObject: any): Promise<boolean>;

    /**
     * Dispose any open resources.
     */
    Dispose(): void;
}