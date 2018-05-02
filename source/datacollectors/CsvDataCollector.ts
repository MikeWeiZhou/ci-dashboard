
import * as csv from "csv-parse"
import * as fs from "fs"

import { IDataCollector } from "./IDataCollector"

/**
 * CsvDataCollector.
 * 
 * Returns a stream to the CSV file.
 */
export class CsvDataCollector implements IDataCollector
{
    private _filepath: string;

    /**
     * Constructor.
     * @param {string} filepath to CSV to-be read
     */
    constructor(filepath: string)
    {
        this._filepath = filepath;
    }

    /**
     * Initialize the data source.
     * @override
     */
    Initialize(): void
    {
    }

    /**
     * Returns a stream of the csv file.
     * @returns {any} stream to the csv file
     * @override
     */
    GetStream(): any
    {
        return fs.createReadStream(this._filepath)
            .pipe(csv({columns: true}));
    }

    /**
     * Cleanup/dispose any open resources.
     * @override
     */
    Cleanup(): void
    {
    }
}