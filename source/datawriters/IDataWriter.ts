/**
 * IDataWriter.
 * 
 * Allows writing data to a source.
 */
export interface IDataWriter
{
    /**
     * Initialize the data source.
     */
    Initialize(): void;

    // /**
    //  * Add record to buffer.
    //  * @param {string} table name
    //  * @param {any} record JSON object of the record, MUST BE FLAT (one-leveled)
    //  */
    // AddToBuffer(table: string, record: any): void;

    // /**
    //  * Writes all buffered data to source.
    //  */
    // WriteData(): void;

    /**
     * Write record to data source.
     * @param {string} table name
     * @param {any} record in JSON format, MUST BE FLAT (one-leveled)
     */
    Write(table: string, record: any): void;

    /**
     * Cleanup/dispose any open resources.
     */
    Cleanup(): void;
}