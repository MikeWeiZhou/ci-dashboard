import { Writable } from "stream"

/**
 * IDataReader.
 * 
 * Returns a stream to the data source.
 */
export interface IDataReader
{
    /**
     * Initialize the data source.
     */
    Initialize(): void;

    /**
     * Returns a Writable stream of the data.
     * @returns {Writable} Writable stream of data
     */
    GetStream(): any;

    /**
     * Dispose any open resources.
     */
    Dispose(): void;
}