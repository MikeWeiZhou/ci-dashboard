import * as csv from "csv-parse"
import * as fs from "fs"
import { Writable } from "stream"

import { IDataReader } from "./IDataReader"

/**
 * CsvDataReader.
 * 
 * Returns a stream to the CSV file.
 */
export class CsvDataReader implements IDataReader
{
    private _filepath: string;

    /**
     * Constructor.
     * @param {string} filepath to CSV to-be read
     */
    public constructor(filepath: string)
    {
        this._filepath = filepath;
    }

    /**
     * Initialize the data source.
     * @override
     */
    public Initialize(): void
    {
    }

    /**
     * Returns a Writable stream of the csv file.
     * @returns {Writable} Writable stream to the csv file
     * @override
     */
    public GetStream(): Writable
    {
        return fs.createReadStream(this._filepath)
            .pipe(csv({columns: true}));
    }

    /**
     * Dispose any open resources.
     * @override
     */
    public Dispose(): void
    {
    }
}