import * as csv from "csv-parse"
import * as fs from "fs"
import { Stream } from "stream"
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
    public constructor(filepath: string)
    {
        this._filepath = filepath;
    }

    /**
     * Not used.
     * @param {Date} from
     * @param {Date} to
     * @override
     */
    public Initialize(from: Date, to: Date): void
    {
    }

    /**
     * Returns a stream to the CSV file.
     * @returns {Stream} stream to the CSV file
     * @override
     */
    public GetStream(): Stream
    {
        return fs.createReadStream(this._filepath)
            .pipe(csv({columns: true}));
    }

    /**
     * Not used.
     * @override
     */
    public Dispose(): void
    {
    }
}