import { Stream } from "stream"

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
     * Returns a stream to the data.
     * @returns {Stream} stream of data
     */
    GetStream(): Stream;

    /**
     * Dispose any open resources.
     */
    Dispose(): void;
}